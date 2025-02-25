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

export { formatName, isRunningInTauri, sleep, updateTheme };
