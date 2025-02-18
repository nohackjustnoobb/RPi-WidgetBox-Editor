import "./index.css";

import { render } from "preact";

import { App } from "./app.tsx";
import { updateTheme } from "./services/utils.ts";

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => updateTheme());
updateTheme();

render(<App />, document.getElementById("root")!);
