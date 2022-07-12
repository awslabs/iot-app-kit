import { MinimalViewPortConfig } from '@synchro-charts/core';
import { Howl } from 'howler';

export type ErrorDetails = { msg: string; type?: string; status?: string };

export interface ProviderObserver<DataType> {
  next: (data: DataType) => void;
  error?: (error: any) => void;
}

export interface Provider<Result> {
  subscribe(observer: ProviderObserver<Result>): void;
  unsubscribe(): void;
}

export interface ProviderWithViewport<Result> extends Provider<Result> {
  updateViewport(viewport: MinimalViewPortConfig): void;
}

export interface Query<Result, Params = void> {
  build(sessionId: string, params?: Params): Provider<Result>;
}

export interface TimeQuery<Result, Params = void> extends Query<Result, Params> {
  build(sessionId: string, params?: Params): ProviderWithViewport<Result>;
}

export interface TreeProvider<Result, Branch> extends Provider<Result> {
  expand(branch: Branch): void;
  collapse(branch: Branch): void;
}

export interface TreeQuery<Result, Branch, Params = void> extends Query<Result, Params> {
  build(sessionId: string, params?: Params): TreeProvider<Result, Branch>;
}

export type DataModuleSession = {
  close: () => void;
};
export type Session = {
  close: () => void;
};

export type AudioPlayerConfig = {
  isMuted: boolean;
  isPlaying: boolean;
  maxVolume: number;
  severity: number | undefined;
  soundID: number | undefined;
  player: Howl | undefined;
  localDev: boolean;
};

export interface AudioPlayerInterface {
  readonly config: AudioPlayerConfig;
  isPlaying(): boolean;
  isMuted(): boolean;
  mute(): void;
  unmute(): void;
  play({ severity, volume, audioSrc }: { severity: number; volume: number; audioSrc?: string }): boolean;
  stop(): void;
  setMaxVolume(maxVolume: number): void;
  getMaxVolume(): number;
}

export type AudioAlertConfig = {
  isMuted: boolean;
  volume: number;
  severity: number;
  player: Howl | undefined;
  soundID: number | undefined;
  audioSrc: string | undefined;
};

export interface AudioAlertInterface {
  readonly config: AudioAlertConfig;
  isMuted(): boolean;
  unmute(): void;
  mute(): void;
  play(): boolean;
  setVolume(volume: number): void;
  setSeverity(severity: number): void;
  setAudioSrc(audioSrc: string): void;
}
