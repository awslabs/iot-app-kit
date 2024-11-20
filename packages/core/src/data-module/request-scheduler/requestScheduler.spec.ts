import { SECOND_IN_MS } from '../../common/time';
import RequestScheduler from './requestScheduler';

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

it('creates a task request and continue to request at the given refresh rate', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = vi.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(cb).toHaveBeenCalledTimes(Math.floor(secondsElapsed));
});

it('stops the task request loop after remove function is called with the same id', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = vi.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  cb.mockClear();
  scheduler.remove(id);

  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
  expect(cb).not.toHaveBeenCalled();
});

it('does not affect the existing schedulers when remove is called on an id that does not exist', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = vi.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  cb.mockClear();
  scheduler.remove('random-id');

  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
  expect(cb).toHaveBeenCalledTimes(Math.floor(secondsElapsed));
});

it('stops the task request loop if current time is beyond refreshExpiration', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = vi.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
    refreshExpiration: Date.now() + 2.5 * SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(cb).toHaveBeenCalledTimes(2);

  cb.mockClear();

  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
  expect(cb).not.toHaveBeenCalled();
});

it('returns true when the given id exists within the scheduler store', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = vi.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(scheduler.isScheduled(id)).toBeTrue();
});

it('resets task request intervals when document visibility changes', () => {
  Object.defineProperty(document, 'hidden', { writable: true, value: false });

  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = vi.fn();

  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  // Make the document hidden
  Object.defineProperty(document, 'hidden', { value: true, writable: true });
  document.dispatchEvent(new Event('visibilitychange'));

  // Make the document visible again
  Object.defineProperty(document, 'hidden', { value: false, writable: true });
  document.dispatchEvent(new Event('visibilitychange'));

  // The interval should reset, simulating the same behavior as if the tab was made active again
  const secondsElapsed = 2.4;
  vi.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(cb).toHaveBeenCalledTimes(Math.floor(secondsElapsed));
});

it('does not reset intervals when document visibility changes but the document is still hidden', () => {
  Object.defineProperty(document, 'hidden', { writable: true, value: false });

  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = vi.fn();

  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  Object.defineProperty(document, 'hidden', { value: true, writable: true });
  document.dispatchEvent(new Event('visibilitychange'));

  expect(cb).not.toHaveBeenCalled();
});

it('synchronizes intervals when a new interval is created', () => {
  const scheduler = new RequestScheduler();
  const id1 = 'id1';
  const id2 = 'id2';
  const cb1 = vi.fn();
  const cb2 = vi.fn();

  scheduler.create({
    id: id1,
    cb: cb1,
    refreshRate: SECOND_IN_MS,
  });

  vi.advanceTimersByTime(SECOND_IN_MS);
  expect(cb1).toHaveBeenCalledTimes(1);

  cb1.mockClear();

  scheduler.create({
    id: id2,
    cb: cb2,
    refreshRate: SECOND_IN_MS,
  });

  vi.advanceTimersByTime(SECOND_IN_MS);
  expect(cb1).toHaveBeenCalledTimes(1);
  expect(cb2).toHaveBeenCalledTimes(1);

  vi.advanceTimersByTime(SECOND_IN_MS);
  expect(cb1).toHaveBeenCalledTimes(2);
  expect(cb2).toHaveBeenCalledTimes(2);
});
