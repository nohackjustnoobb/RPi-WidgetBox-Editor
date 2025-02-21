import './app.scss';

import {
  Component,
  Fragment,
} from 'preact';

import { mdiPlus } from '@mdi/js';

import AddPlugin from './components/addPlugin';
import Config from './components/config';
import Icon from './components/icon';
import ScaleWrapper from './components/scaleWrapper';
import WebComponents from './components/webComponents';
import editor, { Config as ConfigValue } from './services/editor';
import { formatName } from './services/utils';

const SCALE_CONSTANT = 2500;

interface State {
  selected?: string;
  showAddPlugin: boolean;
}

export class App extends Component<{}, State> {
  state: State = {
    showAddPlugin: false,
  };

  constructor() {
    super();

    editor.listen(this.forceUpdate.bind(this));
    window.addEventListener("resize", () => this.forceUpdate());
  }

  onInput(value: string, c: ConfigValue<any, any>): void {
    let parsed: any = value;
    const selectedPlugin =
      this.state.selected && editor.get(this.state.selected);
    if (!selectedPlugin) return;

    switch (typeof c.default) {
      case "boolean":
        parsed = parsed === "true";
        break;
      case "number":
      case "bigint":
        parsed = Number(parsed);
        break;
    }

    selectedPlugin.configs = selectedPlugin.configs.map((c2) => {
      if (c2.name == c.name) c2.value = parsed;
      return c2;
    });

    editor.config(selectedPlugin);
  }

  render({}, { selected, showAddPlugin }: State) {
    const selectedPlugin = selected && editor.get(selected);

    return (
      <Fragment>
        <AddPlugin
          show={showAddPlugin}
          close={() => this.setState({ showAddPlugin: false })}
        />
        <ul class="plugins">
          <li
            class="plugin"
            onClick={() => this.setState({ showAddPlugin: true })}
          >
            <Icon path={mdiPlus} />
            <span class="name">Add Plugin</span>
          </li>
          {editor.plugins.map((p) => (
            <li
              class={`plugin ${!p.enabled && "disabled"} ${
                selected === p.name && "selected"
              }`}
              onClick={() => this.setState({ selected: p.name })}
            >
              <span class="name">{formatName(p.name)}</span>
            </li>
          ))}
        </ul>
        <div class="editor">
          <div class="preview">
            {selectedPlugin ? (
              selectedPlugin.enabled ? (
                <ScaleWrapper scale={SCALE_CONSTANT / window.innerWidth}>
                  <WebComponents
                    tag={selected}
                    src={selectedPlugin.script.url!}
                    {...Object.fromEntries(
                      selectedPlugin.configs.map((c) => [c.name, c.value])
                    )}
                  />
                </ScaleWrapper>
              ) : (
                <span class="disabled">Disabled</span>
              )
            ) : (
              <span class="no-selected">No Plugin Selected</span>
            )}
          </div>
          <ul class="configs">
            {selectedPlugin ? (
              <>
                <li class={"config info"}>
                  <h2>
                    {formatName(selectedPlugin.name)}{" "}
                    <span>v{selectedPlugin.version}</span>
                  </h2>
                  {selectedPlugin.description && (
                    <span>{selectedPlugin.description}</span>
                  )}
                  <div class="divider" />
                  <h3>Configs: </h3>
                </li>
                {selectedPlugin.configs.map((c) => (
                  <Config
                    disabled={!selectedPlugin.enabled && c.name !== "enabled"}
                    onInput={this.onInput.bind(this)}
                    config={c}
                  />
                ))}
                <li class="config">
                  <button
                    onClick={() => {
                      if (
                        !confirm("Are you sure you want to reset the configs?")
                      )
                        return;

                      editor.reset(selectedPlugin);
                    }}
                  >
                    Reset Configs
                  </button>
                  <button
                    onClick={() => {
                      if (
                        !confirm("Are you sure you want to remove this plugin?")
                      )
                        return;

                      editor.remove(selected);
                      this.setState({ selected: undefined });
                    }}
                  >
                    Remove Plugin
                  </button>
                </li>
              </>
            ) : (
              <span class="no-selected">No Plugin Selected</span>
            )}
          </ul>
        </div>
      </Fragment>
    );
  }
}
