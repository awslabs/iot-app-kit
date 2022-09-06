import { RequestProcessorWorkerGroup } from './requestProcessorWorkerGroup';
import { Observable, Subscriber } from 'rxjs';
import { finalize } from 'rxjs/operators';

it('test constructor', () => {
  expect(() => {
    new RequestProcessorWorkerGroup<string, number>(
      () => {
        return new Observable<number>();
      },
      (request) => request
    );
  }).not.toThrowError();
});

class SubscriberRecord<Q, R> {
  public query: Q;
  public subscriber: Subscriber<R>;
  constructor(query: Q, subscriber: Subscriber<R>) {
    this.query = query;
    this.subscriber = subscriber;
  }
}

// A test fixture that records the calls to the worker factory method and exposes the subscriber for testing
class WorkerRecorder<Q, R> {
  private lastSubscriberStack: SubscriberRecord<Q, R>[] = [];
  private counter = 0;

  createWorker(query: Q): Observable<R> {
    const observable: Observable<R> = new Observable<R>((subscriber) => {
      this.counter++;
      this.lastSubscriberStack.push(new SubscriberRecord<Q, R>(query, subscriber));
    });
    return observable;
  }

  workerFactory() {
    return (query: Q) => this.createWorker(query);
  }

  popLastSubscription(): SubscriberRecord<Q, R> | undefined {
    return this.lastSubscriberStack.pop();
  }

  getWorkerCount(): number {
    return this.counter;
  }
}

// A test fixture that records all values sent to a Subscriber for later inspection
class SubscriberRecorder<T> extends Subscriber<T> {
  private recorded: [T?] = [];
  next(value?: T) {
    super.next(value);
    this.recorded.push(value);
  }

  length(): number {
    return this.recorded.length;
  }

  peek(): T | undefined {
    return this.length() > 0 ? this.recorded[this.length() - 1] : undefined;
  }
}

const identity = <T>(i: T): T => i;

it('test single consumer, single response', () => {
  const workerRecorder: WorkerRecorder<string, number> = new WorkerRecorder();
  const workerGroup: RequestProcessorWorkerGroup<string, number> = new RequestProcessorWorkerGroup<string, number>(
    workerRecorder.workerFactory(),
    identity
  );
  const recorder: SubscriberRecorder<number> = new SubscriberRecorder<number>();

  workerGroup.subscribe('test', recorder);
  expect(workerRecorder.getWorkerCount()).toEqual(1);
  expect(recorder.length()).toEqual(0);

  const subRecord = workerRecorder.popLastSubscription();
  subRecord?.subscriber.next(12345);
  expect(recorder.length()).toEqual(1);
  expect(recorder.peek()).toEqual(12345);
});

it('test multiple consumer, single query', () => {
  const workerRecorder: WorkerRecorder<string, number> = new WorkerRecorder();
  const workerGroup: RequestProcessorWorkerGroup<string, number> = new RequestProcessorWorkerGroup<string, number>(
    workerRecorder.workerFactory(),
    identity
  );
  const firstConsumer: SubscriberRecorder<number> = new SubscriberRecorder<number>();
  const secondConsumer: SubscriberRecorder<number> = new SubscriberRecorder<number>();

  workerGroup.subscribe('test', firstConsumer);
  expect(workerRecorder.getWorkerCount()).toEqual(1);
  expect(firstConsumer.length()).toEqual(0);

  workerGroup.subscribe('test', secondConsumer);
  // this is the key: we have 2 subscriber but only 1 worker for the same query
  expect(workerRecorder.getWorkerCount()).toEqual(1);
  expect(firstConsumer.length()).toEqual(0);
  expect(secondConsumer.length()).toEqual(0);

  const worker = workerRecorder.popLastSubscription();
  worker?.subscriber.next(12345);

  expect(firstConsumer.length()).toEqual(1);
  expect(firstConsumer.peek()).toEqual(12345);

  expect(secondConsumer.length()).toEqual(1);
  expect(secondConsumer.peek()).toEqual(12345);
});

it('late joining consumers immediately get the latest value', () => {
  const workerRecorder: WorkerRecorder<string, number> = new WorkerRecorder();
  const workerGroup: RequestProcessorWorkerGroup<string, number> = new RequestProcessorWorkerGroup<string, number>(
    workerRecorder.workerFactory(),
    identity
  );
  const firstConsumer: SubscriberRecorder<number> = new SubscriberRecorder<number>();
  const secondConsumer: SubscriberRecorder<number> = new SubscriberRecorder<number>();

  workerGroup.subscribe('test', firstConsumer);
  const worker = workerRecorder.popLastSubscription();
  worker?.subscriber.next(1);
  worker?.subscriber.next(2);
  worker?.subscriber.next(3);
  worker?.subscriber.next(4);
  worker?.subscriber.next(12345);

  expect(firstConsumer.length()).toEqual(5);
  expect(firstConsumer.peek()).toEqual(12345);

  workerGroup.subscribe('test', secondConsumer);
  expect(secondConsumer.length()).toEqual(1);
  expect(secondConsumer.peek()).toEqual(12345);
});

it('test multiple consumers with different queries', () => {
  const workerRecorder: WorkerRecorder<string, number> = new WorkerRecorder();
  const workerGroup: RequestProcessorWorkerGroup<string, number> = new RequestProcessorWorkerGroup<string, number>(
    workerRecorder.workerFactory(),
    identity
  );
  const firstConsumer: SubscriberRecorder<number> = new SubscriberRecorder<number>();
  const secondConsumer: SubscriberRecorder<number> = new SubscriberRecorder<number>();

  workerGroup.subscribe('First Query', firstConsumer);
  expect(workerRecorder.getWorkerCount()).toEqual(1);
  const firstWorker = workerRecorder.popLastSubscription();
  expect(firstWorker?.query).toEqual('First Query');

  workerGroup.subscribe('Second Query', secondConsumer);
  // this is the key: we have 2 consumers asking for different queries, so 2 workers have been created
  expect(workerRecorder.getWorkerCount()).toEqual(2);
  const secondWorker = workerRecorder.popLastSubscription();
  expect(secondWorker?.query).toEqual('Second Query');

  firstWorker?.subscriber.next(12345);
  secondWorker?.subscriber.next(678910);

  expect(firstConsumer.length()).toEqual(1);
  expect(firstConsumer.peek()).toEqual(12345);

  expect(secondConsumer.length()).toEqual(1);
  expect(secondConsumer.peek()).toEqual(678910);
});

it('test finalizer deletes completed queries', () => {
  const workerRecorder: WorkerRecorder<string, number> = new WorkerRecorder();
  const workerGroup: RequestProcessorWorkerGroup<string, number> = new RequestProcessorWorkerGroup<string, number>(
    workerRecorder.workerFactory(),
    identity
  );
  const recorder: SubscriberRecorder<number> = new SubscriberRecorder<number>();

  workerGroup.subscribe('test', recorder);
  expect(workerRecorder.getWorkerCount()).toEqual(1);
  expect(workerGroup.size()).toEqual(1);
  const subRecord = workerRecorder.popLastSubscription();
  subRecord?.subscriber.next(12345);
  subRecord?.subscriber.complete();

  expect(recorder.length()).toEqual(1);
  expect(recorder.peek()).toEqual(12345);

  // expect no workers to remain because finalizer ran to delete the worker
  expect(workerGroup.size()).toEqual(0);
});

it('test finalizer deletes queries with no subscribers', () => {
  const workerRecorder: WorkerRecorder<string, number> = new WorkerRecorder();
  const workerGroup: RequestProcessorWorkerGroup<string, number> = new RequestProcessorWorkerGroup<string, number>(
    workerRecorder.workerFactory(),
    identity
  );
  const recorder: SubscriberRecorder<number> = new SubscriberRecorder<number>();

  workerGroup.subscribe('test', recorder);
  expect(workerRecorder.getWorkerCount()).toEqual(1);
  expect(workerGroup.size()).toEqual(1);
  recorder.unsubscribe();

  // expect no workers to remain because finalizer ran to delete the worker
  expect(workerGroup.size()).toEqual(0);
});

it('producers can run a finalizer when the last subscriber unsubscribes', (done) => {
  const recorder: SubscriberRecorder<number> = new SubscriberRecorder<number>();

  const workerGroup = new RequestProcessorWorkerGroup<string, number>(() => {
    let timeoutID: number | NodeJS.Timer;
    let counter = 0;
    return new Observable<number>((subscriber) => {
      timeoutID = setInterval(function incrementer() {
        counter++;
        subscriber.next(counter);
        if (counter === 5) {
          // Unsubscribe
          expect(recorder.peek()).toEqual(5);
          recorder.unsubscribe();
          // expect no workers to remain because finalizer ran to delete the worker
          expect(workerGroup.size()).toEqual(0);
        }
      }, 5);
    }).pipe(
      finalize(() => {
        clearInterval(timeoutID as number);
        // the test actually ends here when the timeout is cleared
        // if you remove this call to done() the test will hang, timeout and fail
        done();
      })
    );
  }, identity);

  workerGroup.subscribe('test', recorder);
  expect(workerGroup.size()).toEqual(1);
});
