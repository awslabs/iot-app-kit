import { Observable, Subscriber } from 'rxjs';
import { RequestProcessorWorker } from './requestProcessorWorker';

export class RequestProcessorWorkerGroup<TQuery, TResult> {
  private readonly activeQueries: Map<string, RequestProcessorWorker<TResult>> =
    new Map();
  private readonly workerFactory: (query: TQuery) => Observable<TResult>;
  private readonly queryToKey: (query: TQuery) => string;

  constructor(
    workerFactory: (query: TQuery) => Observable<TResult>,
    queryToKey: (query: TQuery) => string
  ) {
    this.workerFactory = workerFactory;
    this.queryToKey = queryToKey;
  }

  public subscribe(query: TQuery, observer: Subscriber<TResult>) {
    const key: string = this.queryToKey(query);

    if (!this.activeQueries.get(key)) {
      this.activeQueries.set(
        key,
        new RequestProcessorWorker(this.workerFactory(query), () => {
          this.activeQueries.delete(key);
        })
      );
    }

    this.activeQueries.get(key)?.addSubscriber(observer);
  }

  public size(): number {
    return this.activeQueries.size;
  }
}
