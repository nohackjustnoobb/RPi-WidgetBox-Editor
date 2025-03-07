import { confirm as tauriConfirm } from "@tauri-apps/plugin-dialog";

function updateTheme() {
  const useDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  window.document.documentElement.setAttribute(
    "data-theme",
    useDarkMode ? "dark" : "light"
  );
}

function formatName(name: string): string {
  return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

const sleep = async (duration: number): Promise<void> =>
  new Promise((res) => setTimeout(res, duration));

function isRunningInTauri() {
  return "__TAURI_INTERNALS__" in window;
}

async function confirm(message: string): Promise<boolean> {
  return isRunningInTauri()
    ? await tauriConfirm("This action cannot be reverted. Are you sure?", {
        title: "Confirmation",
        kind: "warning",
      })
    : window.confirm(message);
}

export { confirm, formatName, isRunningInTauri, sleep, updateTheme };
