# Finnegans Wake Key

An original reader's key to James Joyce's *Finnegans Wake*, built as an installable web app for reading on an iPad.

- **Map**: the four books on Vico's cycle
- **Cast**: the family and their many masks
- **Chapters**: all 17, with tap-to-open notes tagged Solid, Likely or Debated
- **Words**: portmanteau coinages split into their languages
- **Say it**: a read-aloud of key lines from Anna Livia Plurabelle (I.8) in a female Dublin voice, plus pronunciation of names and coinages with respellings
- **Motifs**: nine recurring shapes, linked to chapters
- **My notes**: your marginalia, kept on your device, exportable as Markdown

Works offline once installed. No accounts, no tracking, no build step.

## Install on iPad

1. Open the site in Safari.
2. Tap **Share**, then **Add to Home Screen**.
3. Launch it from the home screen. It opens full screen and works offline.

Notes live in the device's storage. Use **My notes > Copy all notes** now and then, since iOS can clear storage for web apps that go unused for several weeks.

## Run locally

```sh
npm run dev   # serves public/ at http://localhost:4173
```

## Deploy (Cloudflare Pages)

Connect this repo in Cloudflare Pages with:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | *(leave blank)* |
| Build output directory | `public` |
| Production branch | `main` |

Every push to `main` deploys. Add a custom domain under the Pages project's **Custom domains** tab.

## Pronunciation audio

Clips are generated with the ElevenLabs API from two lists, each with its own voice, and committed to `public/audio/`:

- `public/data/pronunciations.json`: names and coinages (Sean, Dublin narrator)
- `public/data/loop.json`: the book's last words running into its first (Sinéad)
- `public/data/readaloud.json`: the I.8 read-aloud as a dialogue. `voices` maps each `speaker` (a, b) to a voice: Sinéad and Aoife, both female Irish voices, with per-voice settings such as `speed`
 The page plays them when present and falls back to the device's own voice (an Irish English voice where the device has one) when they are not.

**One-time setup:** in GitHub, go to **Settings > Secrets and variables > Actions** and add a secret `ELEVENLABS_API_KEY`. Optional: a variable `ELEVEN_MODEL` to change the model (default `eleven_multilingual_v2`).

**Generate:** the *Generate pronunciation audio* workflow runs whenever either list changes on `main`, or by hand from the **Actions** tab. It only generates missing or changed clips.

Locally:

```sh
ELEVENLABS_API_KEY=... npm run audio             # missing or changed only
ELEVENLABS_API_KEY=... npm run audio -- --only=quarks,howth
ELEVENLABS_API_KEY=... npm run audio:force       # everything
```

**Add a phrase:** add an item to either list. Keep read-aloud fragments short (under 15 words each); the Wake is still under copyright in the US.

```json
{"id": "shaun-post", "text": "Shaun the Post", "say": "SHAWN the POST", "note": "Optional context."}
```

Use `speak` when the voice mispronounces the written form; it is what gets spoken, while `text` is what is shown.

If the API returns a voice-not-found error, add the voice (Sean, Sinéad or Aoife) to **My Voices** in your ElevenLabs account first. Library voices must be in your account before the API can use them.

## Updating content

Chapter, cast, word and motif content lives in `public/app.js`. After changing the app shell, bump `VERSION` in `public/sw.js` so installed copies refresh.

## License

Code: MIT. Guide content: CC BY 4.0. Audio: ElevenLabs terms. See `LICENSE`.
