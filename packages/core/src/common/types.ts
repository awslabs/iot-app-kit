import { TimeSeriesDataRequest, Viewport } from '../data-module/data-cache/requestTypes';
import { TimeSeriesData } from '../data-module/types';

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
  /**
   * Builds the query into a provider
   * @param sessionId
   * @param params
   */
  build(sessionId: string, params?: Params): Provider<Result>;

  /**
   * Returns a string which is unique to the query
   */
  toQueryString(): string;
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

export type TimeSeriesDataQuery = TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;

export type DataModuleSession = {
  close: () => void;
};
export type Session = {
  close: () => void;
};
