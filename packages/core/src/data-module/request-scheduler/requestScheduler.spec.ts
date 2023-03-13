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
