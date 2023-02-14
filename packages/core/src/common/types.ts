import { Viewport } from '../data-module/data-cache/requestTypes';

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
  updateViewport(viewport: Viewport): void;
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
