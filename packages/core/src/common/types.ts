import {
  Annotation,
  COMPARISON_OPERATOR,
  DataStreamId,
  MinimalViewPortConfig,
  ThresholdValue,
} from '@synchro-charts/core';

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

export interface Threshold<T extends ThresholdValue = ThresholdValue> extends Annotation<T> {
  comparisonOperator: COMPARISON_OPERATOR;
  severity?: number;
  dataStreamIds?: DataStreamId[];
  audioAlert?: AudioAlert;
}

export type AudioAlert = {
  volume: number;
  audioSrc?: string;
};

export type AudioPlayerConfig = {
  isMuted: boolean;
  isPlaying: boolean;
  maxVolume: number;
};

export interface AudioPlayer {
  readonly config: AudioPlayerConfig;
  isPlaying(): boolean;
  isMuted(): boolean;
  mute(): void;
  unmute(): void;
  play({ severity, volume, audioSrc }: { severity: number; volume: number; audioSrc?: string }): boolean;
  stop(): void;
  setMaxVolume(maxVolume: number): void;
}
