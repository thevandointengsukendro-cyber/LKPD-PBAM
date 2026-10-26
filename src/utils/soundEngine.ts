// Web Audio API Sound Engine (100% Offline, Pure Synthesizer)

class SoundEngine {
  private ctx: AudioContext | null = null;
  public bgmEnabled: boolean = false;
  public sfxEnabled: boolean = true;
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playPopSfx(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.125);
  }

  public playGachaSpinSfx(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const arpNotes = [392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99];
    // 1.2 seconds fast arpeggio ticks (15 steps * 0.08s = 1.2s)
    for (let i = 0; i < 15; i++) {
      const t = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(arpNotes[i % arpNotes.length], t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.075);
    }

    // Victory chime (C5 - E5 - G5 - C6) at 1.2s
    const chimeNotes = [523.25, 659.25, 783.99, 1046.5];
    chimeNotes.forEach((freq, idx) => {
      const t = now + 1.2 + idx * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  public playCheckAnswerSfx(allOrHigh: boolean): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (allOrHigh) {
      // Ting-tong ceria
      const notes = [659.25, 880.0, 1046.5];
      notes.forEach((freq, i) => {
        const t = now + i * 0.14;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.34);
      });
    } else {
      // Pengingat lembut
      const notes = [440.0, 392.0];
      notes.forEach((freq, i) => {
        const t = now + i * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      });
    }
  }

  public toggleBgm(forceState?: boolean): boolean {
    this.bgmEnabled = forceState !== undefined ? forceState : !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBgmLoop();
    } else {
      this.stopBgmLoop();
    }
    return this.bgmEnabled;
  }

  public toggleSfx(forceState?: boolean): boolean {
    this.sfxEnabled = forceState !== undefined ? forceState : !this.sfxEnabled;
    if (this.sfxEnabled) {
      this.playPopSfx();
    }
    return this.sfxEnabled;
  }

  private startBgmLoop(): void {
    this.stopBgmLoop();
    const ctx = this.getContext();
    if (!ctx) return;

    // Gentle cheerful lo-fi chiptune melody loop at volume 0.08
    const melody = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 698.46, 880.0, 698.46,
      523.25, 659.25, 783.99, 1046.5,
      783.99, 659.25, 587.33, 523.25,
    ];

    const playStep = () => {
      if (!this.bgmEnabled) return;
      const c = this.getContext();
      if (!c) return;
      const now = c.currentTime;
      const freq = melody[this.bgmStep % melody.length];
      this.bgmStep++;

      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.38);

      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    };

    playStep();
    this.bgmTimer = window.setInterval(playStep, 450);
  }

  private stopBgmLoop(): void {
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
