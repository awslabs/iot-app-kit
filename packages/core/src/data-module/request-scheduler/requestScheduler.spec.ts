import { SECOND_IN_MS } from '../../common/time';
import RequestScheduler from './requestScheduler';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

it('creates a task request and continue to request at the given refresh rate', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(cb).toHaveBeenCalledTimes(Math.floor(secondsElapsed));
});

it('stops the task request loop after remove function is called with the same id', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  cb.mockClear();
  scheduler.remove(id);

  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
  expect(cb).not.toHaveBeenCalled();
});

it('does not affect the existing schedulers when remove is called on an id that does not exist', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  cb.mockClear();
  scheduler.remove('random-id');

  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
  expect(cb).toHaveBeenCalledTimes(Math.floor(secondsElapsed));
});

it('stops the task request loop if current time is beyond refreshExpiration', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
    refreshExpiration: Date.now() + 2.5 * SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(cb).toHaveBeenCalledTimes(2);

  cb.mockClear();

  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
  expect(cb).not.toHaveBeenCalled();
});

it('returns true when the given id exists within the scheduler store', () => {
  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(scheduler.isScheduled(id)).toBeTrue();
});

it('resets task request intervals when document visibility changes', () => {
  Object.defineProperty(document, 'hidden', { writable: true, value: false });

  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();

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
  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(cb).toHaveBeenCalledTimes(Math.floor(secondsElapsed));
});

it('does not reset intervals when document visibility changes but the document is still hidden', () => {
  Object.defineProperty(document, 'hidden', { writable: true, value: false });

  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();

  scheduler.create({
    id,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  Object.defineProperty(document, 'hidden', { value: true, writable: true });
  document.dispatchEvent(new Event('visibilitychange'));

  expect(cb).not.toHaveBeenCalled();
});
