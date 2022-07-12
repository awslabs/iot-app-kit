import { AudioAlertInterface, AudioAlertConfig } from './types';
import { mostSevere, leastSevere } from './constants';
import { AudioPlayer } from './audioPlayer';

export const audioAlertPlayer = new AudioPlayer();

export class AudioAlert implements AudioAlertInterface {
  config: AudioAlertConfig;

  constructor({
    isMuted = false,
    volume = 1.0,
    severity = 3,
    audioSrc,
  }: {
    isMuted?: boolean;
    volume?: number;
    severity?: number;
    audioSrc?: string;
  }) {
    this.config = {
      isMuted: isMuted,
      volume: volume,
      severity: severity,
      player: undefined,
      soundID: undefined,
      audioSrc: audioSrc,
    };
  }

  public isMuted(): boolean {
    return this.config.isMuted;
  }

  public unmute(): void {
    this.config.isMuted = false;
  }

  public mute(): void {
    this.config.isMuted = true;
    audioAlertPlayer.stop();
  }

  public play(): boolean {
    if (this.config.isMuted) {
      return false;
    }
    const isPlayed = audioAlertPlayer.play({
      severity: this.config.severity,
      volume: this.config.volume,
      audioSrc: this.config.audioSrc,
    });
    if (isPlayed) {
      this.config.soundID = audioAlertPlayer.config.soundID;
      this.config.player = audioAlertPlayer.config.player;
    }
    return isPlayed;
  }

  public setVolume(volume: number) {
    // can't be less than 0 or greater than 1.0
    this.config.volume = this.calculateVolume(volume);
    if (this.config.player && this.config.soundID) {
      this.config.player.volume(this.config.volume * audioAlertPlayer.getMaxVolume(), this.config.soundID);
    }
  }

  public setSeverity(severity: number) {
    // can't set severity to be more than mostSevere or less than leastSevere
    this.config.severity = this.calculateSeverity(severity);
  }

  public setAudioSrc(audioSrc: string) {
    this.config.audioSrc = audioSrc;
  }

  private calculateSeverity(severity: number): number {
    return Math.max(Math.min(severity, leastSevere), mostSevere);
  }

  private calculateVolume(volume: number): number {
    return Math.max(Math.min(volume, 1.0), 0.0);
  }

  get volume() {
    return this.config.volume;
  }

  get severity() {
    return this.config.severity;
  }

  get audioSrc() {
    return this.config.audioSrc;
  }
}
