import { Howl } from 'howler';
import { leastSevere, mostSevere, defaultAudioSrc } from './constants';
import { AudioPlayerInterface, AudioPlayerConfig } from './types';

export class AudioPlayer implements AudioPlayerInterface {
  config: AudioPlayerConfig;

  constructor(localDev = false) {
    this.config = {
      isMuted: false,
      isPlaying: false,
      maxVolume: 1.0,
      severity: undefined,
      soundID: undefined,
      player: undefined,
      localDev: localDev, // set to true if developing locally, otherwise might run into CORS error
    };
  }

  public isPlaying(): boolean {
    return this.config.isPlaying;
  }

  public isMuted(): boolean {
    return this.config.isMuted;
  }

  public mute(): void {
    if (this.config.player && this.config.soundID) {
      this.config.player.mute(true, this.config.soundID);
    }
    this.config.isMuted = true;
  }

  public unmute(): void {
    if (this.config.player && this.config.soundID) {
      this.config.player.mute(false, this.config.soundID);
    }
    this.config.isMuted = false;
  }

  /* Plays the incoming alert if no other alert is playing, or if the incoming alert has
     a higher severity than the currently playing one. Returns true if incoming alert is
     played, false otherwise */
  public play({ severity, volume, audioSrc }: { severity: number; volume: number; audioSrc?: string }) {
    severity = this.calculateSeverity(severity);
    // if there's another alert playing, stop if new alert is more severe
    if (this.isMoreSevere(severity)) {
      this.stop();
    }

    volume = Math.max(Math.min(volume, 1.0), 0.0);
    if (!this.isPlaying()) {
      const newPlayer = new Howl({
        src: [audioSrc ?? defaultAudioSrc[severity - 1]],
        volume: volume * this.getMaxVolume(),
        mute: this.isMuted(),
        html5: this.config.localDev, //Web Audio API doesn't work on local development due to cross origin
        onend: () => {
          // updates AudioAlertPlayer when sound ends
          this.stop();
        },
      });

      this.config.soundID = newPlayer.play();
      this.config.player = newPlayer;
      this.config.severity = severity;
      this.config.isPlaying = true;
      return true;
    }
    return false;
  }

  public stop(): void {
    if (this.config.player) {
      // Unload and destroy a Howl objects. This will immediately stop all sounds attached to this sound and remove it from the cache.
      if (this.config.player.state() != 'unloaded') {
        this.config.player.unload();
      } else {
        this.config.player.stop();
      }
    }

    this.config.severity = undefined;
    this.config.soundID = undefined;
    this.config.player = undefined;
    this.config.isPlaying = false;
  }

  public setMaxVolume(maxVolume: number): void {
    // can't be less than 0 or greater than 1.0
    this.config.maxVolume = this.calculateMaxVolume(maxVolume);

    if (this.config.player && this.config.soundID) {
      this.config.player.volume(this.config.player.volume() * this.config.maxVolume, this.config.soundID);
    }
  }

  public getMaxVolume(): number {
    return this.config.maxVolume;
  }

  private calculateSeverity(severity: number): number {
    return Math.max(Math.min(severity, leastSevere), mostSevere);
  }

  private calculateMaxVolume(maxVolume: number): number {
    return Math.max(Math.min(maxVolume, 1.0), 0.0);
  }

  private isMoreSevere(newSeverity: number): boolean {
    // Lower number corresponds to higher severity
    return this.config.severity ? newSeverity < this.config.severity : false;
  }
}
