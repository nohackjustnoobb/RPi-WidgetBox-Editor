interface Message {
  type: string;
  data?: any;
}

class WebSocketClient {
  private socket: WebSocket | null = null;

  constructor(
    private url: string,
    private onmessage: (mesg: Message) => void,
    private onopen: () => void,
    private reconnectInterval = 5000
  ) {
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = this.onopen.bind(this);

    this.socket.onmessage = (event) => this.onmessage(JSON.parse(event.data));
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => this.connect(), this.reconnectInterval);
    };
  }

  send(mesg: Message) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(mesg));
    } else {
      console.warn("WebSocket not open. Message not sent.");
    }
  }
}

interface Config<T> {
  name: string;
  type: string;
  value: T;
  default: T;
}

interface Plugin {
  name: string;
  version: string;
  enabled: boolean;
  description?: string;
  url?: string;
  configs: Array<Config<any>>;
  script: {
    url?: string;
    inline?: string;
  };
}

class Editor {
  ws: WebSocketClient;
  _plugins: { [name: string]: Plugin } = {};
  _listeners: Array<() => void> = [];
  host: string;

  set plugins(plugins: Array<Plugin>) {
    this._plugins = {};
    plugins
      .map((p) => {
        p.enabled = p.configs.find((c) => c.name == "enabled")!.value;
        p.script.url = "http://" + this.host + p.script.url;
        return p;
      })
      .forEach((p) => (this._plugins[p.name] = p));

    for (const listener of this._listeners) listener();
  }

  get plugins() {
    return Object.values(this._plugins);
  }

  get(name: string) {
    return this._plugins[name];
  }

  constructor() {
    const searchParams = new URLSearchParams(window.location.search);
    this.host = searchParams.get("url") || window.location.host;

    this.ws = new WebSocketClient(
      `ws://${this.host}`,
      this.handler.bind(this),
      () => {
        this.ws.send({
          type: "listPlugins",
        });
      }
    );
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
        this.plugins = this.plugins.filter((p) => p.name !== name);
        break;
      case "error":
        console.error("Error:", mesg.data);
        break;
      // IGNORE
      case "broadcast":
        break;
      default:
        console.warn("Unknown plugin type:", mesg.type);
        break;
    }
  }

  listen(listener: () => void) {
    this._listeners.push(listener);
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

  remove(name: string) {
    this.ws.send({
      type: "removePlugin",
      data: { name },
    });
  }

  add(plugin: string, meta: boolean = false) {
    this.ws.send({
      type: "addPlugin",
      data: meta ? { meta: JSON.parse(plugin) } : { url: plugin },
    });
  }
}

const editor = new Editor();

export default editor;
export type { Config, Message, Plugin };
