import {
  type Observable,
  ReplaySubject,
  type Subscriber,
  type Subscription,
} from 'rxjs';
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
  private readonly subscribers: Subscriber<T>[] = [];

  constructor(producer: Observable<T>, finalizer: () => void) {
    super(1);
    // when the Observable calls complete(), call finalizer()
    this.producer = producer.pipe(finalize(finalizer));
    // connect the single producer to all consumers
    this.broadcastSubscription = this.producer.subscribe(this);
    // when the last observer unsubscribes, call finalizer()
    this.broadcastSubscription.add(finalizer);
  }

  private removeSubscriber(subscriber: Subscriber<T>) {
    const index = this.subscribers.indexOf(subscriber);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  public addSubscriber(subscriber: Subscriber<T>): Subscription {
    this.subscribers.push(subscriber as Subscriber<T>);
    subscriber.add(() => {
      this.removeSubscriber(subscriber);
      if (this.subscribers.length === 0) {
        this.broadcastSubscription.unsubscribe();
      }
    });

    return super.subscribe(subscriber);
  }
}
