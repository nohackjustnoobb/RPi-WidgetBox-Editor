import "./addStyle.scss";

import { Component, Fragment } from "preact";

import editor from "../../services/editor";
import usePopUp, { PopUpProps } from "../popUp/popUp";

interface State {
  isUrl: boolean;
  input: string;
}

class AddStyle extends Component<PopUpProps, State> {
  state: State = {
    isUrl: false,
    input: "",
  };

  render({ close }: PopUpProps, { isUrl, input }: State) {
    return (
      <Fragment>
        <h2>Add Custom Style</h2>
        <div>
          <span>{isUrl ? "URL: " : "CSS: "}</span>
          {isUrl ? (
            <input
              type="text"
              value={input}
              autoComplete="off"
              autoCapitalize={"off"}
              autoCorrect={"off"}
              placeholder="Enter CSS file URL..."
              onInput={(e) =>
                this.setState({
                  input: (e.target as HTMLInputElement).value,
                })
              }
            />
          ) : (
            <textarea
              value={input}
              autoComplete="off"
              autoCapitalize={"off"}
              autoCorrect={"off"}
              placeholder="Enter your custom CSS here..."
              onInput={(e) =>
                this.setState({
                  input: (e.target as HTMLTextAreaElement).value,
                })
              }
            />
          )}
        </div>
        <div>
          <span>
            Add Using <b>URL</b>
          </span>
          <input
            type="checkbox"
            checked={isUrl}
            onClick={() => this.setState({ isUrl: !isUrl })}
          />
        </div>
        <div>
          <button onClick={close}>Close</button>
          <button
            onClick={() => {
              editor.setStyle(input, isUrl);
              close();
            }}
          >
            Apply
          </button>
        </div>
      </Fragment>
    );
  }
}

export default usePopUp(AddStyle, "add-style");
