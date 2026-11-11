// Generative Ambient Soundscape & Realistic Liquid Physical Acoustics
// Uses Web Audio API with zero external dependencies
// Realistically synthesizes liquid pouring, acoustic vessel cavity resonance,
// effervescent bubbling, crystal clinking, and low vortex draining.

class AudioSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private isPlaying = true; // Enabled by default!
  private isInitialized = false;

  constructor() {
    // Automatically bind to first user interaction to satisfy browser autoplay policies
    if (typeof window !== 'undefined') {
      const unlock = () => {
        if (!this.isInitialized && this.isPlaying) {
          this.initContext();
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        }
        window.removeEventListener('click', unlock);
        window.removeEventListener('scroll', unlock);
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };

      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('scroll', unlock, { passive: true });
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  public initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isPlaying ? 0.16 : 0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Warm sub-harmonic bass atmosphere (54Hz tuned to 432Hz philosophical scale)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(54.0, this.ctx.currentTime);

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(108.0, this.ctx.currentTime);

      const oscFilter = this.ctx.createBiquadFilter();
      oscFilter.type = 'lowpass';
      oscFilter.frequency.setValueAtTime(160, this.ctx.currentTime);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.28, this.ctx.currentTime);

      this.osc1.connect(oscFilter);
      this.osc2.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(this.masterGain);

      // Subtle effervescent pink noise layer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.035;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      this.osc1.start();
      this.osc2.start();
      this.noiseNode.start();

      this.isInitialized = true;
    } catch {
      // AudioContext unavailable
    }
  }

  public toggle(): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) {
      this.isPlaying = !this.isPlaying;
      return this.isPlaying;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.masterGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.3);
      this.isPlaying = false;
    } else {
      this.masterGain.gain.setTargetAtTime(0.18, this.ctx.currentTime, 0.4);
      this.isPlaying = true;
    }

    return this.isPlaying;
  }

  public playClick(pitch = 880) {
    this.initContext();
    if (!this.ctx || !this.isPlaying) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch {
      // Ignore
    }
  }

  // Realistic liquid pouring acoustics (fluid stream noise + acoustic bottle cavity resonance)
  public playPour() {
    this.initContext();
    if (!this.ctx || !this.isPlaying) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const duration = 1.4;

      // 1. Resonant cavity tone (rising pitch as bottle fills!)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      const oscFilter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + duration);

      oscFilter.type = 'bandpass';
      oscFilter.frequency.setValueAtTime(340, now);
      oscFilter.frequency.exponentialRampToValueAtTime(780, now + duration);
      oscFilter.Q.setValueAtTime(3.5, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.14, now + 0.15);
      oscGain.gain.linearRampToValueAtTime(0.10, now + duration * 0.75);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);

      // 2. Liquid stream turbulent splashing noise
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.12;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(450, now);
      noiseFilter.frequency.linearRampToValueAtTime(1150, now + duration);
      noiseFilter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  // Realistic fluid draining / vortex clearing acoustics
  public playDrain() {
    this.initContext();
    if (!this.ctx || !this.isPlaying) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const duration = 0.9;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + duration);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Ignore
    }
  }

  // Resonant crystal glass clink / ice acoustic chime
  public playClink() {
    this.initContext();
    if (!this.ctx || !this.isPlaying) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;

      // High crystal bell tone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2640, now);
      osc1.frequency.exponentialRampToValueAtTime(2100, now + 0.25);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(5280, now); // Harmonic overtone
      osc2.frequency.exponentialRampToValueAtTime(4200, now + 0.15);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.30);
      osc2.stop(now + 0.30);
    } catch {
      // Ignore
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSystem = new AudioSystem();
