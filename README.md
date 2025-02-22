# RPi WidgetBox Editor

This repository contains the editor for [RPi-WidgetBox](https://github.com/nohackjustnoobb/RPi-WidgetBox). It is designed specifically for modifying widget settings and should not be used as a standalone application. Instead, it must be integrated directly into the main app using the build script provided in the [RPi-WidgetBox](https://github.com/nohackjustnoobb/RPi-WidgetBox) repository.

## Development Setup

Follow these steps to set up the development environment:

1. Clone the repository

```bash
git clone https://github.com/nohackjustnoobb/RPi-WidgetBox-Editor.git && cd RPi-WidgetBox-Editor
```

2. Install dependencies

```bash
yarn install
```

3. Start the development server

```bash
yarn dev
```

By default, the development server runs on port 5173 and connects to the current path via WebSocket.

- To specify a different WebSocket URL, append ?url={other-host-address} to the URL in your browser.
- Only include the host address—do not add the protocol (e.g., example.com, not http://example.com).

## Roadmap to v1.0.0

- [ ] Configurable editor settings
- [ ] Compatibility with Tauri (using embedded functions)
