import { AssetQuery } from './types';
import { Observable, Subscriber } from 'rxjs';
import { RequestProcessorWorker } from './requestProcessorWorker';

export class RequestProcessorWorkerGroup<TQuery extends AssetQuery, TResult> {
  private readonly activeQueries: Record<string, RequestProcessorWorker<TResult>> = {};
  private readonly workerFactory: (query: TQuery) => Observable<TResult>;
  private readonly queryToKey: (query: TQuery) => string;

  constructor(
    workerFactory: (query: TQuery) => Observable<TResult>,
    queryToKey: (query: TQuery) => string) {
    this.workerFactory = workerFactory;
    this.queryToKey = queryToKey;
  }

  public subscribe(query: TQuery, observer: Subscriber<TResult>) {
    const key: string = this.queryToKey(query);

    if (!this.activeQueries[key]) {
      this.activeQueries[key] = new RequestProcessorWorker(this.workerFactory(query), () => {
        delete this.activeQueries[key];
      });
    }

    this.activeQueries[key].subscribe(observer);
  }
}
