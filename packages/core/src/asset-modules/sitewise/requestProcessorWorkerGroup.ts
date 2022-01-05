import { AssetQuery } from './types';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { RequestProcessorWorker } from './requestProcessorWorker';

export class RequestProcessorWorkerGroup<TQuery extends AssetQuery, TResult> {
  private readonly activeQueries: Map<string, RequestProcessorWorker<TResult>> = new Map();
  private readonly workerFactory: (query: TQuery) => Observable<TResult>;
  private readonly queryToKey: (query: TQuery) => string;

  constructor(
    workerFactory: (query: TQuery) => Observable<TResult>,
    queryToKey: (query: TQuery) => string) {
    this.workerFactory = workerFactory;
    this.queryToKey = queryToKey;
  }

  public subscribe(query: TQuery, observer: Subscriber<TResult>): Subscription|undefined {
    const key: string = this.queryToKey(query);

    if (!this.activeQueries.get(key)) {
      this.activeQueries.set(key, new RequestProcessorWorker(this.workerFactory(query), () => {
        this.activeQueries.delete(key);
      }));
    }

    return this.activeQueries.get(key)?.subscribe(observer);
  }

  public size(): number {
    return this.activeQueries.size;
  }
}
