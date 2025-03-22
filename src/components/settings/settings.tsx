import "./settings.scss";

import { Component, Fragment } from "preact";

import editor from "../../services/editor";
import usePopUp, { PopUpProps } from "../popUp/popUp";
import AddStyle from "../addStyle/addStyle";

interface State {
  host: string;
  showAddStyle: boolean;
}

class Settings extends Component<PopUpProps, State> {
  state = {
    host: localStorage.getItem("host") || "",
    showAddStyle: false,
  };

  unsubscribe: (() => void) | undefined;

  componentDidMount() {
    this.unsubscribe = editor.subscribe(this.forceUpdate.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe?.();
  }

  render({ close }: PopUpProps, { host, showAddStyle }: State) {
    return (
      <Fragment>
        <AddStyle
          show={showAddStyle}
          close={() => this.setState({ showAddStyle: false })}
        />
        <h2>Settings</h2>
        <div>
          <span>Override Host: </span>
          <input
            type="text"
            value={host}
            autoComplete="off"
            autoCapitalize={"off"}
            placeholder={"Address and Port Only"}
            autoCorrect={"off"}
            onInput={(e) =>
              this.setState({
                host: (e.target as HTMLInputElement).value,
              })
            }
          />
        </div>
        <div>
          <span>Custom Style: </span>
          <button onClick={() => this.setState({ showAddStyle: true })}>
            Edit
          </button>
          {editor.style && (
            <button onClick={() => editor.removeStyle()} className="danger">
              Remove
            </button>
          )}
        </div>
        <div>
          <button onClick={close} className="danger">
            Close
          </button>
          <button
            onClick={() => {
              if (localStorage.getItem("host") !== host) {
                if (!host) {
                  localStorage.removeItem("host");
                  window.location.reload();
                }

                editor.setHost(host);
              }

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

export default usePopUp(Settings, "settings");
