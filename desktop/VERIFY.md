# Verifying smog — real-use-case workflow

Two ways to verify the app. Run **A** first (no mic/GUI needed), then **B** to exercise the full
experience as a real user.

---

## A. Automated backend check (Ask + Notes)

Proves the OpenAI integration works with your saved key + model — the same requests the app makes.

```bash
cd desktop
npm run verify
```

Expected: `🎉 All backend checks passed`. This covers the **Ask** (streaming, transcript-aware) and
**Notes** (structured Markdown) code paths. If it fails, the error tells you what's wrong (bad key,
quota, model name). Override the model for a run with `SMOG_MODEL=gpt-5.6-luna npm run verify`.

> What this does **not** cover: the microphone/transcription engines and the GUI — that's B below.

---

## B. Manual end-to-end walkthrough — "mock technical interview"

**Prerequisites**

- A working microphone, quiet-ish room.
- Your OpenAI key already saved (Settings → OpenAI API key), model = `gpt-4o-mini`.
- The app running: `npm run dev`.

**The scenario:** smog is helping you through a live technical interview. Read the interviewer lines
aloud (or have a friend/another device say them) so the transcript fills up realistically.

### Scripted dialogue (read the *Interviewer* lines aloud)

> 1. **Interviewer:** *"Welcome. Can you explain the difference between let and const in JavaScript?"*
> 2. **Interviewer:** *"Good. How would you optimize a slow database query?"*
> 3. **Interviewer:** *"Last one — what is the event loop, in one sentence?"*

### Steps

| # | Action | Expected result | ✓ |
|---|--------|-----------------|---|
| 1 | Launch the app. | A translucent, rounded overlay appears, always on top, top-right of the screen. | ☐ |
| 2 | Drag the header. | The window moves. The corner buttons (minimize / gear / X) still clickable. | ☐ |
| 3 | Click the gear → confirm **OpenAI API key** is filled, **Model = gpt-4o-mini**, **Engine = Web Speech API**. Close Settings. | Settings show your key + chosen options. | ☐ |
| 4 | On the **Listen** tab, click the mic. Approve the mic permission prompt. | Badge shows "Listening…", pulsing mic, "Web Speech" engine pill. | ☐ |
| 5 | Read interviewer line **#1** aloud. | A timestamped line appears in the transcript within ~1s. | ☐ |
| 6 | Read lines **#2** and **#3** aloud. | Each appears as its own transcript line. | ☐ |
| 7 | Press **Ctrl+Shift+A**. | Overlay jumps to the **Ask** tab and the question box gets focus. | ☐ |
| 8 | Type: *"Give a one-sentence model answer to the last question."* → Enter. | An answer streams in token-by-token, referencing the event loop (context-aware). | ☐ |
| 9 | Ask a follow-up: *"What did the candidate discuss overall?"* | The answer summarizes let/const + DB queries → proves transcript context flows in. | ☐ |
| 10 | Click **Stop** mid-stream on a new question. | Streaming halts immediately. | ☐ |
| 11 | Go to the **Notes** tab → click **Generate**. | Structured Markdown appears (## Summary / Key Points / Action Items). | ☐ |
| 12 | Edit the notes text, then **Copy**. | "Copied" appears; pasting elsewhere works. | ☐ |
| 13 | Click **.md** (download). | A `smog-notes-YYYY-MM-DD.md` file downloads. | ☐ |
| 14 | Press **Ctrl+Shift+Space**. | Overlay hides. Press again → it reappears. | ☐ |
| 15 | Press **Ctrl+Shift+L**. | Listening toggles on/off from any tab. | ☐ |
| 16 | Right-click the **tray icon** → *Settings*. | Settings open. Then tray → *Show/Hide* toggles the window. | ☐ |
| 17 | Settings → switch **Transcription engine** to *Whisper API* while listening. | Listening restarts on Whisper; say a line → "(transcribing…)" then text appears (~7s chunks). | ☐ |
| 18 | Switch engine back to *Web Speech* in Settings. | Engine restarts on Web Speech (real-time again). | ☐ |
| 19 | Tray → *Quit*. Relaunch `npm run dev`. | Key, model, engine, theme are all **retained**. (Transcript is intentionally not persisted — it starts empty.) | ☐ |

### What "works" means here

If steps **1, 4–6, 8, 11, 14** all pass, the core loop is verified: **overlay → live transcript →
context-aware Ask → generated Notes**, plus the global show/hide shortcut. The remaining steps cover
shortcuts, tray, export, Whisper, and settings persistence.

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
npm run verify     # automated backend check (Ask + Notes)
npm run build      # typecheck + production build
```
