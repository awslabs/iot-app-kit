import { Howl } from 'howler';
import { AudioAlertPlayer } from './audioAlertPlayer';
import { mostSevere, leastSevere } from './constants';

export class AudioAlert {
  private _audioAlertPlayer: AudioAlertPlayer;
  private _isMute: boolean;
  private _volume;
  private _severity;
  private _player: Howl | undefined;
  private _soundID: number | undefined;
  private _audioSrc: string | undefined;

  constructor({
    audioAlertPlayer,
    isMuted = false,
    volume = 1.0,
    severity = 3,
    audioSrc,
  }: {
    audioAlertPlayer: AudioAlertPlayer;
    isMuted?: boolean;
    volume?: number;
    severity?: number;
    audioSrc?: string;
  }) {
    this._isMute = isMuted;
    this._audioAlertPlayer = audioAlertPlayer;
    this._volume = volume;
    this._severity = severity;
    this._audioSrc = audioSrc;
  }

  public isMuted(): boolean {
    return this._isMute;
  }

  public unmute(): void {
    this._isMute = false;
  }

  public mute(): void {
    this._isMute = true;
    if (this._player) {
      this.audioAlertPlayer.stop();
    }
  }

  public play(): boolean {
    if (this._isMute) {
      return false;
    }
    const isPlayed = this._audioAlertPlayer.play({
      severity: this._severity,
      volume: this._volume,
      audioSrc: this._audioSrc,
    });
    if (isPlayed) {
      this._soundID = this._audioAlertPlayer.soundID;
      this._player = this._audioAlertPlayer.player;
    }
    return isPlayed;
  }

  public setVolume(volume: number) {
    // can't be less than 0 or greater than 1.0
    this._volume = Math.max(Math.min(volume, 1.0), 0.0);
    if (this._player && this._soundID) {
      this._player.volume(this._volume * this._audioAlertPlayer.getMaxVolume(), this._soundID);
    }
  }

  public setSeverity(severity: number) {
    // can't set severity to be more than mostSevere or less than leastSevere
    this._severity = Math.max(Math.min(severity, leastSevere), mostSevere);
  }

  public setAudioSrc(audioSrc: string) {
    this._audioSrc = audioSrc;
  }

  get audioAlertPlayer() {
    return this._audioAlertPlayer;
  }

  get volume() {
    return this._volume;
  }

  get severity() {
    return this._severity;
  }

  get audioSrc() {
    return this._audioSrc;
  }
}
