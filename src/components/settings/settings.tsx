import './settings.scss';

import {
  Component,
  Fragment,
} from 'preact';

import editor from '../../services/editor';
import usePopUp, { PopUpProps } from '../popUp/popUp';

interface State {
  host: string;
}

class Settings extends Component<PopUpProps, State> {
  state = {
    host: localStorage.getItem("host") || "",
  };

  render({ close }: PopUpProps, { host }: State) {
    return (
      <Fragment>
        <h2>Settings</h2>
        <div>
          <span>Override Host: </span>
          <input
            type="text"
            value={host}
            autoComplete="off"
            autoCapitalize={"off"}
            autoCorrect={"off"}
            onInput={(e) =>
              this.setState({
                host: (e.target as HTMLInputElement).value,
              })
            }
          />
        </div>
        <div>
          <button onClick={close}>Close</button>
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
