import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * * broadcast any new value of the worker to all consumers
 * * Newly attached consumers immediately receive the latest value
 * * When the worker completes the 'onTeardown' callback is invoked
 * * When the last subscriber unsubscribed the 'onTeardown' callback is invoked
 * * When 'onTeardown' is invoked all subscribers are automatically completed.
 */
export class RequestProcessorWorker<T> extends ReplaySubject<T> {
  private readonly producer: Observable<T>;
  private readonly broadcastSubscription: Subscription;

  constructor(producer: Observable<T>, finalizer: () => void) {
    super();
    // when the Observable calls complete(), call finalizer()
    this.producer = producer.pipe(finalize(finalizer));
    // connect the single producer to all consumers
    this.broadcastSubscription = this.producer.subscribe(this);
    // when the last observer unsubscribes, call finalizer()
    this.broadcastSubscription.add(finalizer);
  }
}
