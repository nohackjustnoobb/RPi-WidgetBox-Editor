import "./addPlugin.scss";

import { Component } from "preact";

import editor from "../services/editor";

interface Props {
  show: boolean;
  close: () => void;
}

interface State {
  isMeta: boolean;
  input: string;
}

export default class AddPlugin extends Component<Props, State> {
  state: State = {
    isMeta: false,
    input: "",
  };

  render({ show }: Props, { isMeta, input }: State) {
    const close = () => {
      this.props.close();
      this.setState({ input: "", isMeta: false });
    };

    return (
      <div
        style={{
          display: show ? "flex" : "none",
        }}
        class="add-plugin"
      >
        <span
          style={{
            opacity: show ? 0.5 : 0,
          }}
          class="background"
          onClick={close}
        />
        <div class="container">
          <h2>Add Plugin</h2>
          <div>
            <span>{isMeta ? "JSON: " : "URL: "}</span>
            {isMeta ? (
              <textarea
                value={input}
                autoComplete="off"
                autoCapitalize={"off"}
                autoCorrect={"off"}
                onInput={(e) =>
                  this.setState({
                    input: (e.target as HTMLTextAreaElement).value,
                  })
                }
              />
            ) : (
              <input
                type="text"
                value={input}
                autoComplete="off"
                autoCapitalize={"off"}
                autoCorrect={"off"}
                onInput={(e) =>
                  this.setState({
                    input: (e.target as HTMLInputElement).value,
                  })
                }
              />
            )}
          </div>
          <div>
            <span>
              Add Using <b>meta.json</b>
            </span>
            <input
              type="checkbox"
              checked={isMeta}
              onClick={() => this.setState({ isMeta: !isMeta })}
            />
          </div>
          <div>
            <button onClick={close}>Close</button>
            <button
              onClick={() => {
                close();
                editor.add(input, isMeta);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }
}
