#!/usr/bin/env node
// Generates pronunciation clips with the ElevenLabs API.
// Reads  public/data/pronunciations.json and public/data/readaloud.json
//        (each file names its own voice and optional voice settings)
// Writes public/audio/<id>-<hash>.mp3 and public/audio/index.json
//
// Only missing or changed items are generated, so re-runs cost nothing
// unless you edit a phrase. Use --force to regenerate everything,
// or --only=id1,id2 to regenerate specific items.
//
// Env:
//   ELEVENLABS_API_KEY  required
//   ELEVEN_MODEL        optional, default eleven_multilingual_v2

import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SOURCES = ['public/data/pronunciations.json', 'public/data/readaloud.json', 'public/data/loop.json'].map(f => path.join(ROOT, f));
const OUT = path.join(ROOT, 'public/audio');
const INDEX = path.join(OUT, 'index.json');

const key = process.env.ELEVENLABS_API_KEY;
if (!key) { console.error('Set ELEVENLABS_API_KEY first.'); process.exit(1); }

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = (args.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);

const model = process.env.ELEVEN_MODEL || 'eleven_multilingual_v2';
await mkdir(OUT, { recursive: true });
const index = existsSync(INDEX) ? JSON.parse(await readFile(INDEX, 'utf8')) : {};
const DEFAULT_SETTINGS = { stability: 0.55, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true };
const allIds = new Set();

let made = 0, kept = 0, failed = 0;
for (const src of SOURCES) {
  if (!existsSync(src)) continue;
  const data = JSON.parse(await readFile(src, 'utf8'));
  // A list names one `voice`, or several `voices` keyed by each item's `speaker`.
  const voiceOf = it => (data.voices && data.voices[it.speaker]) || data.voice || Object.values(data.voices || {})[0];
  console.log(`\n${path.basename(src)}`);

  // The filename carries a hash of what was spoken, so editing a phrase
  // or changing its voice produces a new file and the service worker's
  // cache-first rule stays safe.
  const fileFor = it => {
    const voice = voiceOf(it).voice_id;
    const h = createHash('sha1').update([voice, model, it.speak || it.text].join('|')).digest('hex').slice(0, 8);
    return `${it.id}-${h}.mp3`;
  };

  for (const it of data.items) {
    allIds.add(it.id);
    const v = voiceOf(it), voice = v.voice_id;
    const settings = { ...DEFAULT_SETTINGS, ...(v.settings || {}) };
    const file = fileFor(it);
    const wanted = force || only.includes(it.id) || index[it.id] !== file || !existsSync(path.join(OUT, file));
    if (!wanted || (only.length && !only.includes(it.id))) { kept++; continue; }

    process.stdout.write(`- ${it.id} [${v.name || voice}]: "${it.speak || it.text}" ... `);
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text: it.speak || it.text, model_id: model, voice_settings: settings })
    });
    if (!res.ok) {
      failed++;
      console.log(`failed (${res.status}) ${(await res.text()).slice(0, 200)}`);
      continue;
    }
    const old = index[it.id];
    await writeFile(path.join(OUT, file), Buffer.from(await res.arrayBuffer()));
    if (old && old !== file && existsSync(path.join(OUT, old))) await unlink(path.join(OUT, old));
    index[it.id] = file;
    made++;
    console.log('ok');
  }
}

// Drop entries for items that were removed from the list.
for (const id of Object.keys(index)) if (!allIds.has(id)) delete index[id];
await writeFile(INDEX, JSON.stringify(index, null, 2) + '\n');
console.log(`\nGenerated ${made}, kept ${kept}, failed ${failed}.`);
if (failed) process.exit(1);
