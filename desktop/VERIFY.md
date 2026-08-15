# Verifying smog — real-use-case workflow

Two ways to verify the app. Run **A** first (no mic/GUI needed), then **B** to exercise the live
copilot end-to-end.

---

## A. Automated backend check (detect + Ask + Notes)

Proves the OpenAI integration works with your saved key + model — the same requests the app makes —
plus a no-network check that spoken questions are detected.

```bash
cd desktop
npm run verify
```

Expected: `🎉 All backend checks passed`. This covers **detectQuestion** (the three scripted
interviewer lines below, and ignoring a statement), **Ask** (streaming, transcript-aware),
and **Notes** (structured Markdown). If it fails, the
error tells you what's wrong (bad key, quota, model name). Override the model for a run with
`SMOG_MODEL=gpt-5.6-luna npm run verify`.

> What this does **not** cover: the microphone/transcription engines and the GUI — that's B below.

---

## B. Manual end-to-end walkthrough — "mock technical interview"

**Prerequisites**

- A working microphone, quiet-ish room.
- Your OpenAI key already saved (first-run card or Settings → OpenAI API key), model = `gpt-4o-mini`.
- The app running: `npm run dev`.

**The scenario:** smog is helping you through a live technical interview. Read the interviewer lines
aloud (or have a friend/another device say them) so the transcript fills up realistically.

### Scripted dialogue (read the _Interviewer_ lines aloud)

> 1. **Interviewer:** _"Welcome. Can you explain the difference between let and const in JavaScript?"_
> 2. **Interviewer:** _"Good. How would you optimize a slow database query?"_
> 3. **Interviewer:** _"Last one — what is the event loop, in one sentence?"_

### Steps

| #   | Action                                                                                                                       | Expected result                                                                                                | ✓   |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --- |
| 1   | Launch the app.                                                                                                              | A translucent overlay appears top-right. If no key is saved, a first-run card asks you to paste an OpenAI key. | ☐   |
| 2   | Drag the header.                                                                                                             | The window moves. The corner buttons (minimize / gear / X) still clickable.                                    | ☐   |
| 3   | Click the gear → confirm **OpenAI API key** is filled, **Model = gpt-4o-mini**, **Engine = Web Speech API**, **Auto-answer = On**. Close Settings. | Settings show your key + chosen options. Auto-answer defaults on. | ☐   |
| 4   | On the **Listen** tab, click the mic. Approve the mic permission prompt.                                                     | Badge shows "Listening…", pulsing mic, "Web Speech" engine pill, **Auto** pill on.                             | ☐   |
| 5   | Read interviewer line **#1** aloud. Stay on **Listen**.                                                                      | Transcript line appears, then a **Live answer** card streams a let/const answer — no Ask tab, no typing.       | ☐   |
| 6   | Read lines **#2** and **#3** aloud.                                                                                          | Each new question replaces the card (latest wins). Transcript lines that triggered an answer are highlighted.  | ☐   |
| 7   | Press **Ctrl+Shift+A**.                                                                                                      | Overlay jumps to the **Ask** tab. Auto-answers are already in history, labeled "From transcript".              | ☐   |
| 8   | Type: _"Give a one-sentence model answer to the last question."_ → Enter.                                                    | An answer streams in token-by-token, referencing the event loop (context-aware).                               | ☐   |
| 9   | Ask a follow-up: _"What did the candidate discuss overall?"_                                                                 | The answer summarizes let/const + DB queries → proves transcript context flows in.                             | ☐   |
| 10  | Click **Stop** mid-stream on a new question.                                                                                 | Streaming halts immediately.                                                                                   | ☐   |
| 11  | Go to the **Notes** tab → click **Generate**.                                                                                | Structured Markdown appears (## Summary / Key Points / Action Items).                                          | ☐   |
| 12  | Edit the notes text, then **Copy**.                                                                                          | "Copied" appears; pasting elsewhere works.                                                                     | ☐   |
| 13  | Click **.md** (download).                                                                                                    | A `smog-notes-YYYY-MM-DD.md` file downloads.                                                                   | ☐   |
| 14  | Press **Ctrl+Shift+Space**.                                                                                                  | Overlay hides. Press again → it reappears.                                                                     | ☐   |
| 15  | Press **Ctrl+Shift+L**.                                                                                                      | Listening toggles on/off from any tab.                                                                         | ☐   |
| 16  | Right-click the **tray icon** → _Settings_.                                                                                  | Settings open. Then tray → _Show/Hide_ toggles the window.                                                     | ☐   |
| 17  | Settings → switch **Transcription engine** to _Whisper API_ while listening.                                                 | Listening restarts on Whisper; say a line → "(transcribing…)" then text appears (~7s chunks).                  | ☐   |
| 18  | Switch engine back to _Web Speech_ in Settings.                                                                              | Engine restarts on Web Speech (real-time again).                                                               | ☐   |
| 19  | Click the **Auto** pill on Listen to turn auto-answer off, then say another question.                                        | Transcript still updates; no new Live answer starts.                                                           | ☐   |
| 20  | Tray → _Quit_. Relaunch `npm run dev`.                                                                                       | Key, model, engine, theme, and auto-answer are **retained**. (Transcript is intentionally not persisted.)      | ☐   |

### What "works" means here

If steps **1, 4–6, 8, 11, 14** all pass, the core loop is verified: **overlay → live transcript →
auto-answer on Listen → context-aware Ask → generated Notes**, plus the global show/hide shortcut.
The remaining steps cover shortcuts, tray, export, Whisper, Auto toggle, and settings persistence.

### Troubleshooting

- **No transcript appears (Web Speech):** this engine relies on a remote endpoint and can be flaky in
  Electron. If you see a "network / service-not-allowed" banner, switch to the **Whisper API** engine
  in Settings (uses your key, more reliable).
- **Ask/Notes say "Add your OpenAI key":** run `npm run verify` — if it passes, the key is fine and the
  issue is the app not loading settings; check `%APPDATA%\desktop\settings.json`.
- **Overlay not always on top:** some full-screen/games windows may sit above it; the level is `floating`.
- **Mic denied:** Windows Settings → Privacy → Microphone → allow desktop apps.

---

## Quick command reference

```bash
cd desktop
npm run dev        # run the app
npm run verify     # automated backend check (detect + Ask + Notes)
npm run build      # typecheck + production build
```
