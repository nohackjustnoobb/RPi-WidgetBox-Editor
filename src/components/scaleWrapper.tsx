import { Component } from "preact";
import { PropsWithChildren } from "preact/compat";

interface Props extends PropsWithChildren {
  scale: number;
}

export default class ScaleWrapper extends Component<Props> {
  render({ scale, children }: Props) {
    const dScale = (1 - scale) / scale;
    const dxy = ((scale - 1) / 2) * -100;

    return (
      <div class="scale-wrapper">
        <div
          class="scale-wrapper-inner"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            transform: `scale(${1 + dScale}) translate(${dxy}%, ${dxy}%)`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
