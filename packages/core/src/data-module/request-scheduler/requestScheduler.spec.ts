import { HOUR_IN_MS, SECOND_IN_MS } from '../../common/time';
import RequestScheduler from './requestScheduler';

it('creates a task request and continue to request at the given duration rate', () => {
  jest.useFakeTimers();

  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    duration: SECOND_IN_MS,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(cb).toHaveBeenCalledTimes(Math.floor(secondsElapsed));
});

it('stops the task request loop after remove function is called with the same id', () => {
  jest.useFakeTimers();

  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    duration: HOUR_IN_MS,
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
  jest.useFakeTimers();

  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    duration: HOUR_IN_MS,
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

it('returns true when the given id exists within the scheduler store', () => {
  jest.useFakeTimers();

  const scheduler = new RequestScheduler();
  const id = 'id';
  const cb = jest.fn();
  scheduler.create({
    id,
    duration: HOUR_IN_MS,
    cb,
    refreshRate: SECOND_IN_MS,
  });

  const secondsElapsed = 2.4;
  jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

  expect(scheduler.isScheduled(id)).toBeTrue();
});
