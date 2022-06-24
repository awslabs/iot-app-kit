import { Howl } from 'howler';
import { leastSevere, mostSevere, defaultAudioSrc } from './constants';

export class AudioAlertPlayer {
  private _isMuted = false;
  private _isPlaying = false;
  private _maxVolume = 1.0;
  private _severity: number | undefined;
  private _soundID: number | undefined;
  private _player: Howl | undefined;

  public isPlaying(): boolean {
    return this._isPlaying;
  }

  public isMuted(): boolean {
    return this._isMuted;
  }

  public mute(): void {
    if (this._player && this._soundID) {
      this._player.mute(true, this._soundID);
    }
    this._isMuted = true;
  }

  public unmute(): void {
    if (this._player && this._soundID) {
      this._player?.mute(false, this._soundID);
    }
    this._isMuted = false;
  }

  /* plays the incoming alert if no other alert is playing, or if the incoming alert has
     a higher severity than the currently playing one. Returns true if incoming alert is
     played, false otherwise */
  public play = ({ severity, volume, audioSrc }: { severity: number; volume: number; audioSrc?: string }): boolean => {
    severity = Math.max(Math.min(severity, leastSevere), mostSevere);
    // if there's another alert playing, stop if new alert is more severe
    if (this.isMoreSevere(severity)) {
      this.stop();
    }

    volume = Math.max(Math.min(volume, 1.0), 0.0);
    if (!this.isPlaying()) {
      const newPlayer = new Howl({
        src: [audioSrc ?? defaultAudioSrc[severity - 1]],
        volume: volume * this.getMaxVolume(),
        onend: () => {
          // updates AudioAlertPlayer when sound ends
          this.stop();
        },
      });

      this._soundID = newPlayer.play();
      this._player = newPlayer;
      this._severity = severity;
      this._isPlaying = true;
      if (this.isMuted()) {
        this._player?.mute(true, this._soundID);
      }
      return true;
    }
    return false;
  };

  public stop(): void {
    if (this._player) {
      // Unload and destroy a Howl objects. This will immediately stop all sounds attached to this sound and remove it from the cache.
      if (this._player.state() != 'unloaded') {
        this._player.unload();
      } else {
        this._player.stop();
      }
    }

    this._severity = undefined;
    this._soundID = undefined;
    this._player = undefined;
    this._isPlaying = false;
  }

  public setMaxVolume(maxVolume: number): void {
    // can't be less than 0 or greater than 1.0
    this._maxVolume = Math.max(Math.min(maxVolume, 1.0), 0.0);

    if (this._player && this._soundID) {
      this._player.volume(this._player.volume() * this._maxVolume, this._soundID);
    }
  }

  public getMaxVolume(): number {
    return this._maxVolume;
  }

  private isMoreSevere = (newSeverity: number) => {
    // Lower number corresponds to higher severity
    return this._severity ? newSeverity < this._severity : false;
  };

  get severity() {
    return this._severity;
  }

  get soundID() {
    return this._soundID;
  }

  get player() {
    return this._player;
  }
}
