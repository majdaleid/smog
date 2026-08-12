# smog — AI Meeting & Interview Copilot (MVP / Proof of Concept)

A clean, simple proof-of-concept inspired by [smog-ai.com](https://smog-ai.com). It has two parts:

1. **`desktop/`** — an Electron overlay app: a translucent, always-on-top panel that transcribes audio live, lets you push-to-ask an LLM for instant answers, and auto-generates notes.
2. **`web/`** — a Next.js marketing landing page in the same glassy aesthetic.

> **Positioning.** Built as a general live AI copilot (meetings, interview practice, accessibility/captioning, language learning). The translucent overlay is a UX feature. Deliberately **out of scope**: any "hidden from screen capture / undetectable" mechanics.

---

## Prerequisites

- **Node.js 18+** and **npm** (developed on Node 22 / npm 10).
- Internet access (for `npm install` and the OpenAI API).
- An **OpenAI API key** — required for the **Ask**, **Notes**, and **Whisper** transcription features. The **Web Speech** transcription engine works with no key.

---

## Desktop app (`desktop/`)

```bash
cd desktop
npm install
npm run dev
```

A translucent overlay appears (top-right), always-on-top. Open **Settings** (gear) and paste your OpenAI API key to enable Ask / Notes / Whisper.

### Modules
- **Listen** — live transcription. Two engines (toggle in Settings):
  - **Web Speech API** (default) — real-time, no key.
  - **Whisper API** — more accurate, requires key.
- **Ask** — push-to-ask: type a question (it auto-attaches the recent transcript as context) and the answer streams in live.
- **Notes** — generate structured Markdown notes (summary / key points / decisions / action items) from the transcript; edit and export to `.md`.

### Global shortcuts (defaults)
| Action | Shortcut |
| --- | --- |
| Show / hide overlay | `Ctrl+Shift+Space` |
| Push-to-Ask (show + focus Ask) | `Ctrl+Shift+A` |
| Start / stop listening | `Ctrl+Shift+L` |

(Use `Cmd` instead of `Ctrl` on macOS.)

### Notes on transcription engines
- **Web Speech API** runs in Chromium and usually works with no setup. If it errors (`network` / `service-not-allowed`), switch to **Whisper** in Settings — that engine is fully self-contained via your OpenAI key.

---

## Landing page (`web/`)

```bash
cd web
npm install
npm run dev
```

Open the printed local URL to view the marketing site.

---

## Tech stack
- **Desktop:** Electron + electron-vite + React + TypeScript + Tailwind CSS v3.
- **Web:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + lucide-react.

## Responsible use
This is a POC for learning/product exploration. Use it ethically — e.g., as a personal accessibility, captioning, or note-taking assistant. Settings (including your API key) are stored locally and never leave your machine except as direct calls to OpenAI.
