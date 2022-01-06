import { Observable, Observer, ReplaySubject, Subscriber, Subscription } from 'rxjs';
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
    0 <= index && this.subscribers.splice(index, 1);
  }

  public addSubscriber(subscriber: Subscriber<T>): Subscription {
    const superSub: Subscription = super.subscribe(subscriber);

    this.subscribers.push(subscriber as Subscriber<T>);
    subscriber.add(() => {
      this.removeSubscriber(subscriber);
      if (this.subscribers.length === 0) {
        this.broadcastSubscription.unsubscribe();
      }
    });

    return superSub;
  }

  /** @deprecated */
  subscribe(observer?: Partial<Observer<T>>): Subscription;
  /** @deprecated */
  subscribe(next: (value: T) => void): Subscription;
  /** @deprecated */
  subscribe(next?: ((value: T) => void) | null, error?: ((error: any) => void) | null, complete?: (() => void) | null): Subscription;
  /** @deprecated */
  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Subscription {
    throw "deprecated, use addObserver";
  }
}
