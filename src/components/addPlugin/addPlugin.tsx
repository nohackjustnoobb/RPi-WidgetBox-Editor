import './addPlugin.scss';

import {
  Component,
  Fragment,
} from 'preact';

import editor from '../../services/editor';
import usePopUp, { PopUpProps } from '../popUp/popUp';

interface State {
  isMeta: boolean;
  input: string;
}

class AddPlugin extends Component<PopUpProps, State> {
  state: State = {
    isMeta: false,
    input: "",
  };

  render({ close }: PopUpProps, { isMeta, input }: State) {
    return (
      <Fragment>
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
              editor.add(input, isMeta);
              close();
            }}
          >
            Add
          </button>
        </div>
      </Fragment>
    );
  }
}

export default usePopUp(AddPlugin, "add-plugin");
