import { Howl } from 'howler';
import { leastSevere, mostSevere, defaultAudioSrc } from './constants';
import { AudioPlayer, AudioPlayerConfig } from './types';

export const calculateSeverity = (severity: number): number => {
  return Math.max(Math.min(severity, leastSevere), mostSevere);
};

export const calculateMaxVolume = (maxVolume: number): number => {
  return Math.max(Math.min(maxVolume, 1.0), 0.0);
};
export class AudioAlertPlayer implements AudioPlayer {
  config: AudioPlayerConfig = {
    isMuted: false,
    isPlaying: false,
    maxVolume: 1.0,
  };
  private soundID: number | undefined;
  private player: Howl | undefined;
  private severity: number | undefined;

  public isPlaying(): boolean {
    return this.config.isPlaying;
  }

  public isMuted(): boolean {
    return this.config.isMuted;
  }

  public mute(): void {
    if (this.player !== undefined && this.soundID !== undefined) {
      this.player.mute(true, this.soundID);
    }
    this.config.isMuted = true;
  }

  public unmute(): void {
    if (this.player !== undefined && this.soundID !== undefined) {
      this.player.mute(false, this.soundID);
    }
    this.config.isMuted = false;
  }

  /* Plays the incoming alert if no other alert is playing, or if the incoming alert has
     a higher severity than the currently playing one. Returns true if incoming alert is
     played, false otherwise */
  public play({ severity, volume, audioSrc }: { severity: number; volume: number; audioSrc?: string }) {
    severity = calculateSeverity(severity);
    // If there's another alert playing, stop if new alert is more severe
    if (this.isMoreSevere(severity)) {
      this.stop();
    }

    volume = Math.max(Math.min(volume, 1.0), 0.0);
    if (!this.isPlaying()) {
      const newPlayer = new Howl({
        src: [audioSrc ?? defaultAudioSrc[severity - 1]],
        volume: volume * this.config.maxVolume,
        mute: this.isMuted(),
        html5: process.env.NODE_ENV === 'development', // Web Audio API doesn't work on local development due to cross origin
        onend: () => {
          // Updates AudioAlertPlayer when sound ends
          this.stop();
        },
      });
      this.soundID = newPlayer.play();
      this.player = newPlayer;
      this.severity = severity;
      this.config.isPlaying = true;
      return true;
    }
    return false;
  }

  public stop(): void {
    if (this.player !== undefined) {
      // Unload and destroy a Howl objects. This will immediately stop all sounds attached to this sound and remove it from the cache.
      if (this.player.state() != 'unloaded') {
        this.player.unload();
      } else {
        this.player.stop();
      }
    }

    this.severity = undefined;
    this.soundID = undefined;
    this.player = undefined;
    this.config.isPlaying = false;
  }

  public setMaxVolume(maxVolume: number): void {
    // Can't be less than 0 or greater than 1.0
    this.config.maxVolume = calculateMaxVolume(maxVolume);

    if (this.player !== undefined && this.soundID !== undefined) {
      this.player.volume(this.player.volume() * this.config.maxVolume, this.soundID);
    }
  }

  private isMoreSevere(newSeverity: number): boolean {
    // Lower number corresponds to higher severity
    return this.severity ? newSeverity < this.severity : false;
  }

  get maxVolume(): number {
    return this.config.maxVolume;
  }
}
