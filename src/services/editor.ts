import { Message, WebSocketClient } from "./webSocket";

interface Option<T> {
  name: string;
  value?: T;
}

interface Config<T1, T2> {
  name: string;
  type: string;
  value: T1;
  default: T1;
  hint?: string;
  options?: Array<Option<T2>>;
}

interface Script {
  url?: string;
  inline?: string;
}

interface BackgroundProcess {
  start: (
    send: (mesg: Message) => void,
    subscribe: (callback: (mesg: Message) => void) => void
  ) => void;
  stop: () => void;
}

interface Plugin {
  name: string;
  version: string;
  enabled: boolean;
  description?: string;
  url?: string;
  configs: Array<Config<any, any>>;
  backgroundScript?: Script;
  script: Script;
  backgroundProcess?: BackgroundProcess;
}

class Editor {
  ws: WebSocketClient;
  _plugins: { [name: string]: Plugin } = {};
  _style: string | null = null;

  changeCallback: Array<() => void> = [];
  backgroundMessageCallback: { [name: string]: (mesg: Message) => void } = {};
  messageCallback: { [name: string]: (mesg: Message) => void } = {};
  host: string;

  set plugins(plugins: Array<Plugin>) {
    this._plugins = {};
    plugins
      .map((p) => {
        if (p.enabled !== undefined) return p;

        p.enabled = p.configs.find((c) => c.name == "enabled")!.value;
        p.script.url = "http://" + this.host + p.script.url;

        if (p.backgroundScript)
          p.backgroundScript.url =
            "http://" + this.host + p.backgroundScript.url;

        return p;
      })
      .forEach((p) => {
        if (this._plugins[p.name] && this._plugins[p.name].backgroundProcess)
          this._plugins[p.name].backgroundProcess!.stop();

        this._plugins[p.name] = p;

        if (p.enabled && p.backgroundScript?.url)
          this.initializePluginBackgrounProcess(p);
      });

    this.notify();
  }

  get plugins() {
    return Object.values(this._plugins);
  }

  set style(style: string | null) {
    // Remove existing style link if present
    const existingLink = document.querySelector("link[data-custom-style]");
    if (existingLink) existingLink.remove();

    if (!style) {
      this._style = null;

      this.notify();
      return;
    }

    this._style = "http://" + this.host + style;

    // Create and append new style link
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = this._style;
    link.setAttribute("data-custom-style", "");
    document.head.appendChild(link);

    this.notify();
  }

  get style() {
    return this._style;
  }

  async initializePluginBackgrounProcess(plugin: Plugin) {
    if (!plugin.backgroundScript?.url) return;

    plugin.backgroundProcess = (
      await import(/* @vite-ignore */ plugin.backgroundScript.url)
    ).default;

    plugin.backgroundProcess!.start(
      (mesg) =>
        this.ws.send({
          type: "pluginMessage",
          data: {
            name: plugin.name,
            mesg,
          },
        }),
      (callback) => (this.backgroundMessageCallback[plugin.name] = callback)
    );
  }

  get(name: string) {
    return this._plugins[name];
  }

  setHost(host: string) {
    this.host = host;

    this.ws.url = `ws://${this.host}`;
    this.ws.close();
    this.ws.connect();

    localStorage.setItem("host", host);
  }

  constructor() {
    const searchParams = new URLSearchParams(window.location.search);
    this.host =
      searchParams.get("host") ||
      localStorage.getItem("host") ||
      window.location.host;

    this.ws = new WebSocketClient(
      `ws://${this.host}`,
      this.handler.bind(this),
      () => {
        this.ws.send({
          type: "listPlugins",
        });

        this.ws.send({
          type: "getStyle",
        });
      }
    );
  }

  notify() {
    for (const callback of this.changeCallback) callback();
  }

  handler(mesg: Message) {
    switch (mesg.type) {
      case "listPlugins":
        this.plugins = mesg.data as Array<Plugin>;
        break;
      case "configPlugin":
      case "addPlugin":
        let plugin = mesg.data as Plugin;
        this.plugins = [...this.plugins, plugin];
        break;
      case "removePlugin":
        let name = mesg.data.name as string;
        if (this._plugins[name]) {
          this._plugins[name].backgroundProcess?.stop();
          delete this._plugins[name];
          this.notify();
        }
        break;
      case "pluginMessage":
        let name2 = mesg.data.name as string;

        if (this.backgroundMessageCallback[name2])
          this.backgroundMessageCallback[name2](mesg.data.mesg);

        if (this.messageCallback[name2])
          this.messageCallback[name2](mesg.data.mesg);

        break;
      case "setStyle":
      case "getStyle":
        this.style = mesg.data.url || null;
        break;
      case "removeStyle":
        this.style = null;
        break;
      case "error":
        console.error("Error:", mesg.data);
        break;
      default:
        console.warn("Unknown plugin type:", mesg.type);
        break;
    }
  }

  subscribe(callback: () => void) {
    this.changeCallback.push(callback);

    return () =>
      (this.changeCallback = this.changeCallback.filter((c) => c !== callback));
  }

  config(plugin: Plugin) {
    this.ws.send({
      type: "configPlugin",
      data: {
        name: plugin.name,
        configs: plugin.configs.map((c) => ({ name: c.name, value: c.value })),
      },
    });
  }

  reset(plugin: Plugin) {
    this.ws.send({
      type: "configPlugin",
      data: {
        name: plugin.name,
        configs: plugin.configs.map((c) => ({
          name: c.name,
          value: c.default,
        })),
      },
    });
  }

  remove(name: string) {
    this.ws.send({
      type: "removePlugin",
      data: { name },
    });
  }

  add(plugin: string, meta: boolean) {
    this.ws.send({
      type: "addPlugin",
      data: meta ? { meta: JSON.parse(plugin) } : { url: plugin },
    });
  }

  setStyle(style: string, isUrl: boolean) {
    this.ws.send({
      type: "setStyle",
      data: isUrl ? { url: style } : { inline: style },
    });
  }

  removeStyle() {
    this.ws.send({ type: "removeStyle" });
  }
}

const editor = new Editor();

export default editor;
export type { Config, Message, Plugin };
