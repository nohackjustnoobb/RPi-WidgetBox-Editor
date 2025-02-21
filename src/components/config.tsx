import { Component } from 'preact';

import { Config as ConfigValue } from '../services/editor';
import { formatName } from '../services/utils';

interface Props {
  onInput: (input: string, c: ConfigValue<any, any>) => void;
  disabled: boolean;
  config: ConfigValue<any, any>;
}

export default class Config extends Component<Props> {
  render({ disabled, config, onInput }: Props) {
    let input;

    switch (config.type) {
      case "select":
        const options = config.options || [];
        input = (
          <select
            onChange={(e) =>
              onInput((e.target as HTMLSelectElement).value, config)
            }
            value={config.value}
          >
            {options.map((o) => (
              <option value={o.value == undefined ? o.name : o.value}>
                {o.name}
              </option>
            ))}
          </select>
        );
        break;
      default:
        input = (
          <input
            type={config.type}
            value={config.value}
            defaultValue={config.value}
            defaultChecked={config.value}
            disabled={disabled}
            onClick={() => {
              if (config.type === "checkbox")
                onInput(String(!config.value), config);
            }}
            onInput={(e) => {
              if (config.type !== "checkbox")
                onInput((e.target as HTMLInputElement).value, config);
            }}
          />
        );
        break;
    }

    return (
      <li class={`config ${disabled && "disabled"}`}>
        <div class="input">
          <span class="name">{formatName(config.name)}</span>
          {input}
        </div>
        {config.hint && <span class="hint">{config.hint}</span>}
      </li>
    );
  }
}
