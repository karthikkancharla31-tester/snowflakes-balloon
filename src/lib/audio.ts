/**
 * High-fidelity synthetic sound effect designer using standard Web Audio API.
 * Designed to bypass external static asset download latency, autoplay blocks, and network failures.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended by browser autoplay guards
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (err) {
    console.error('Failed to initialize AudioContext:', err);
    return null;
  }
}

/**
 * 1. Gentle Whoosh: Low-pass filtered noise with frequency and volume elevation sweeps.
 * Simulates the rushing sound of a winter breeze when snowflakes initiate.
 */
export function playWhoosh() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 1.6;

  // Generate a buffer of white noise
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  // Sweep frequency to simulate air rushing
  filter.frequency.setValueAtTime(100, now);
  filter.frequency.exponentialRampToValueAtTime(750, now + 0.5);
  filter.frequency.exponentialRampToValueAtTime(80, now + duration);
  filter.Q.setValueAtTime(3.0, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.04, now + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noiseSource.start(now);
  noiseSource.stop(now + duration);
}

/**
 * 2. Soft Pop: Fast high-pitch decay with rapid gain release.
 * Simulates a snowflake dissolving or popping on landing.
 */
export function playPop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.08;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Gentle high quality sinus pop
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(350, now + duration);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.02, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

/**
 * 3. Light Airy Ascension: Soft sine sweeps cascading upward with micro vibrato.
 * Simulates helium gas or rubber stretching as the balloon begins its float.
 */
export function playAirFloat() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 1.4;

  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  // Principal climbing pitch
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + duration);

  // Light detuned carrier for rich air feel
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(183, now);
  osc2.frequency.exponentialRampToValueAtTime(443, now + duration);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.025, now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + duration);
  osc2.stop(now + duration);
}

/**
 * 4. Gentle Thump: Acoustic resonant damp rise kick with low pass attenuation.
 * Play when a floating balloon reaches its apex and sails away.
 */
export function playThump() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.25;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(110, now);
  osc.frequency.exponentialRampToValueAtTime(25, now + duration);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(130, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}
