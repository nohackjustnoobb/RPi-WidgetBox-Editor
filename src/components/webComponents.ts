import { Component, createElement } from "preact";

import { sleep } from "../services/utils";

interface Props {
  tag: string;
  src: string;
  insertFunctions?: { [key: string]: any };
  [attr: string]: any;
}

export default class WebComponents extends Component<Props> {
  loaded: Array<string> = [];

  loadScript(src: string) {
    if (this.loaded.includes(src)) return;

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.setAttribute("type", "module");
    head.appendChild(script);

    this.loaded.push(src);
  }

  async insertFunctions() {
    if (!this.props.insertFunctions) return;

    let element: any = document.querySelector(this.props.tag);
    while (!element) {
      await sleep(250);
      element = document.querySelector(this.props.tag);
    }

    for (const [key, value] of Object.entries(this.props.insertFunctions)) {
      if (!element[key]) element[key] = value;
    }
  }

  render({ tag, src, insertFunctions, ...props }: Props) {
    this.loadScript(src);
    this.insertFunctions();

    return createElement(tag, props);
  }
}
