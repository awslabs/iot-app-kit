import { Howl } from 'howler';
import { minimumSeverity, testAudioSrc } from './constants';

export class AudioAlertPlayer {
  private isMute = false;
  private isPlay = false;
  private maxVolume = 1.0;
  private currentlyPlayingSeverity: number = minimumSeverity;
  private soundID: number | undefined = undefined;
  private player: Howl | undefined = undefined;

  public isPlaying(): boolean {
    return this.isPlay;
  }

  public isMuted(): boolean {
    return this.isMute;
  }

  public mute(): void {
    if (this.soundID) {
      this.player?.mute(true, this.soundID);
    }
    this.isMute = true;
  }

  public unmute(): void {
    if (this.soundID) {
      this.player?.mute(false, this.soundID);
    }
    this.isMute = false;
  }

  public play = ({
    severity,
    volume,
    audioSrc,
  }: {
    severity: number;
    volume: number;
    audioSrc?: string;
  }): { soundID: number | undefined; player: Howl | undefined } => {
    if (this.isPlaying() && severity < this.currentlyPlayingSeverity) {
      this.stop();
    }

    volume = Math.max(Math.min(volume, 1.0), 0.0);
    if (!this.isPlaying()) {
      let newPlayer: Howl;
      if (audioSrc) {
        newPlayer = new Howl({
          src: [audioSrc],
          volume: volume * this.getMaxVolume(),
          preload: true,
        });
      } else {
        newPlayer = new Howl({
          src: [testAudioSrc[severity - 1]],
          volume: volume * this.getMaxVolume(),
          preload: true,
          onplayerror: () => {
            newPlayer.once('unlock', () => {
              this.soundID = newPlayer.play();
            });
          },
        });
      }

      // fired when the audio alert is finished
      newPlayer.on('end', () => {
        this.stop();
      });

      this.soundID = newPlayer.play();
      this.player = newPlayer;
      if (this.isMuted()) {
        this.player?.mute(true, this.soundID);
      }
      this.currentlyPlayingSeverity = severity;
      this.isPlay = true;
      return { soundID: this.soundID, player: this.player };
    }
    return { soundID: undefined, player: undefined };
  };

  public stop(): void {
    if (this.player) {
      // Unload and destroy a Howl objects. This will immediately stop all sounds attached to this sound and remove it from the cache.
      if (this.player.state() != 'unloaded') {
        this.player.unload();
      } else {
        this.player.stop();
      }
    }

    this.currentlyPlayingSeverity = minimumSeverity + 1;
    this.player = undefined;
    this.isPlay = false;
  }

  public setMaxVolume(maxVolume: number): void {
    // can't be less than 0 or greater than 1.0
    this.maxVolume = Math.max(Math.min(maxVolume, 1.0), 0.0);

    if (this.player && this.soundID) {
      this.player.volume(this.player.volume() * this.maxVolume, this.soundID);
    }
  }

  public getMaxVolume(): number {
    return this.maxVolume;
  }
}

export class AudioAlert {
  private audioAlertPlayer: AudioAlertPlayer;
  private isMute: boolean;
  private volume = 1.0;
  private severity = 3;
  private player: Howl | undefined;
  private soundID: number | undefined;
  private audioSrc: string | undefined;

  constructor({
    audioAlertPlayer,
    isMuted = false,
    volume = 1.0,
    severity = 3,
  }: {
    audioAlertPlayer: AudioAlertPlayer;
    isMuted?: boolean;
    volume?: number;
    severity?: number;
  }) {
    this.isMute = isMuted;
    this.audioAlertPlayer = audioAlertPlayer;
    this.volume = volume;
    this.severity = severity;
  }

  public isMuted(): boolean {
    return this.isMute;
  }

  public unmute(): void {
    this.isMute = false;
  }

  public mute(): void {
    this.isMute = true;
    if (this.player) {
      this.player.stop();
    }
  }

  public play(audioSrc?: string): Howl | undefined {
    if (this.isMute) {
      this.audioSrc = audioSrc;
      return;
    }

    console.log('try to play, curr severity: ', this.severity);
    const { soundID, player } = this.audioAlertPlayer.play({
      severity: this.severity,
      volume: this.volume,
      audioSrc: audioSrc,
    });
    this.audioSrc = undefined;
    this.soundID = soundID;
    this.player = player;
    console.log(player);
    return player;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(Math.min(volume, 1.0), 0.0);
    if (this.player && this.soundID) {
      this.player.volume(this.volume * this.audioAlertPlayer.getMaxVolume(), this.soundID);
    }
    return this.volume;
  }

  public setSeverity(severity: number) {
    this.severity = Math.max(Math.min(severity, minimumSeverity), 1);
    return this.severity;
  }

  public getAudioAlertPlayer(): AudioAlertPlayer {
    return this.audioAlertPlayer;
  }
}
