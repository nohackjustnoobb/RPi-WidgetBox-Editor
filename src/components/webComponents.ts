import { Component, createElement } from "preact";

interface Props {
  tag: string;
  src: string;
  [attr: string]: any;
}

export default class WebComponents extends Component<Props> {
  render({ tag, src, ...props }: Props) {
    return createElement(tag, props, createElement("script", { src }));
  }
}
