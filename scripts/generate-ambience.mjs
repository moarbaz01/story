import { writeFile } from "node:fs/promises";

const sampleRate = 22050;
const duration = 48;
const samples = new Float32Array(sampleRate * duration);
const tau = Math.PI * 2;
const midi = (note) => 440 * 2 ** ((note - 69) / 12);
const chords = [
  [60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67],
  [60, 64, 67, 71], [57, 60, 64, 69], [53, 57, 60, 64], [55, 60, 62, 67],
  [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67], [60, 64, 67, 71],
];
const melody = [76, 74, 72, 71, 69, 72, 74, 67, 69, 72, 71, 76, 74, 72, 71, 67, 69, 72, 74, 76, 79, 76, 74, 72];

const addTone = (start, length, frequency, volume, voice = "soft") => {
  const first = Math.floor(start * sampleRate);
  const count = Math.floor(length * sampleRate);
  for (let offset = 0; offset < count && first + offset < samples.length; offset += 1) {
    const time = offset / sampleRate;
    const attack = Math.min(1, time / (voice === "pad" ? 1.2 : 0.08));
    const release = Math.min(1, (length - time) / (voice === "pad" ? 1.4 : 0.65));
    const envelope = Math.max(0, attack * release);
    const vibrato = voice === "lead" ? Math.sin(tau * 4.3 * time) * 0.0028 : 0;
    const phase = tau * frequency * time * (1 + vibrato);
    const tone = voice === "bell"
      ? (Math.sin(phase) + Math.sin(phase * 2.01) * 0.28) * Math.exp(-time * 1.45)
      : Math.sin(phase) + Math.sin(phase * 0.5) * (voice === "pad" ? 0.16 : 0.06);
    samples[first + offset] += tone * envelope * volume;
  }
};

chords.forEach((chord, index) => {
  const start = index * 4;
  chord.forEach((note, voice) => addTone(start, 4.15, midi(note - (voice === 0 ? 12 : 0)), voice === 0 ? 0.065 : 0.036, "pad"));
  for (let step = 0; step < 8; step += 1) {
    const note = chord[[0, 2, 1, 3, 2, 1, 0, 2][step]] + 12;
    addTone(start + step * 0.5, 1.25, midi(note), 0.055, "bell");
  }
  addTone(start + 0.35, 2.8, midi(melody[index * 2]), 0.055, "lead");
  addTone(start + 2.2, 1.65, midi(melody[index * 2 + 1]), 0.047, "lead");
});

// Gentle room-like echoes make the synthetic piano and pads feel atmospheric.
for (const [seconds, feedback] of [[0.31, 0.19], [0.53, 0.12], [0.79, 0.07]]) {
  const delay = Math.floor(seconds * sampleRate);
  for (let i = delay; i < samples.length; i += 1) samples[i] += samples[i - delay] * feedback;
}

let peak = 0;
for (let i = 0; i < samples.length; i += 1) peak = Math.max(peak, Math.abs(samples[i]));
const dataSize = samples.length * 2;
const buffer = Buffer.alloc(44 + dataSize);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);
for (let i = 0; i < samples.length; i += 1) {
  const position = i / samples.length;
  const fade = Math.min(1, position / 0.035, (1 - position) / 0.065);
  const normalized = Math.max(-1, Math.min(1, samples[i] / Math.max(peak, 0.001) * 0.72 * fade));
  buffer.writeInt16LE(Math.round(normalized * 32767), 44 + i * 2);
}
await writeFile("D:\\story\\public\\audio\\nisha-ambience.wav", buffer);
process.stdout.write(`Generated ${buffer.length} bytes\n`);
