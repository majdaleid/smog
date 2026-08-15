# smog — desktop overlay

The Electron app half of the smog POC. See the [root README](../README.md) for the full overview.

## Run

```bash
npm install
npm run dev
```

A translucent, always-on-top overlay appears (top-right). On first launch, paste your
OpenAI API key in the window (or later in Settings) to enable **Ask**, **Notes**, auto-answer,
and the **Whisper** engine. The **Web Speech** engine works with no key.

## Modules

- **Listen** — live transcription. Spoken questions can auto-answer on this tab.
  - Web Speech API (default) — real-time, no key. Can be unreliable in Electron; if it errors, switch to Whisper.
  - Whisper API — more accurate, needs an OpenAI key.
- **Ask** — type a question (recent transcript is attached as context); the answer streams in. Push-to-ask: `Ctrl+Shift+A`.
- **Notes** — generate structured Markdown from the transcript; edit, copy, or download `.md`.

## Global shortcuts

| Action | Shortcut |
| --- | --- |
| Show / hide overlay | `Ctrl+Shift+Space` |
| Push-to-Ask | `Ctrl+Shift+A` |
| Start / stop listening | `Ctrl+Shift+L` |

(`Cmd` on macOS.) There's also a tray icon (show/hide, settings, quit).

## Architecture

- `src/main/` — Electron main process: overlay window, tray, global shortcuts, IPC, local settings store.
- `src/preload/` — secure `contextBridge` API exposed as `window.smog` (contextIsolation on, nodeIntegration off).
- `src/renderer/` — React UI: `App` shell + `ListenPanel` / `AskPanel` / `NotesPanel` / `SettingsPanel`, plus `lib/` (OpenAI streaming + notes, and the two STT engines).
- `src/shared/types.ts` — `Settings` shape shared across processes.

## Scripts

- `npm run dev` — run the app (HMR).
- `npm run build` — typecheck + production build to `out/`.
- `npm run build:win` — build a Windows installer via electron-builder.
