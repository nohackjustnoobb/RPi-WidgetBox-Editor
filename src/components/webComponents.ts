import {
  Component,
  createElement,
} from 'preact';

interface Props {
  tag: string;
  src: string;
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

  render({ tag, src, ...props }: Props) {
    this.loadScript(src);

    return createElement(tag, props);
  }
}
