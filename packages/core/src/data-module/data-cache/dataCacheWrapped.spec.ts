import { DataCache } from './dataCacheWrapped';
import { SECOND_IN_MS } from '../../common/time';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';

it('initializes', () => {
  expect(() => new DataCache()).not.toThrowError();
});

it('defaults to an empty cache', () => {
  const dataCache = new DataCache();
  expect(dataCache.getState()).toEqual({});
});

describe('onChange', () => {
  it('no changes occur on initiation', () => {
    const dataCache = new DataCache();
    const listener = jest.fn();

    dataCache.onChange(listener);
    expect(listener).not.toBeCalled();
  });

  it('change is emitted when action is made', () => {
    const dataCache = new DataCache();

    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    const listener = jest.fn();
    dataCache.onChange(listener);
    dataCache.onRequest({ id: ID, resolution: RESOLUTION, first: new Date(), last: new Date() });

    expect(listener).toBeCalledTimes(1);
  });

  it('change is emitted twice when two actions are made', () => {
    const dataCache = new DataCache();

    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    const listener = jest.fn();
    dataCache.onChange(listener);
    dataCache.onRequest({ id: ID, resolution: RESOLUTION, first: new Date(), last: new Date() });
    dataCache.onRequest({ id: ID, resolution: RESOLUTION, first: new Date(), last: new Date() });

    expect(listener).toBeCalledTimes(2);
  });
});

describe('actions', () => {
  it('onRequest works', () => {
    const dataCache = new DataCache();

    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    dataCache.onRequest({ id: ID, resolution: RESOLUTION, first: new Date(), last: new Date() });
    const state = dataCache.getState() as any;

    expect(state[ID][RESOLUTION]).toEqual(
      expect.objectContaining({
        isLoading: true,
        isRefreshing: true,
      })
    );
  });

  it('onError works', () => {
    const dataCache = new DataCache();

    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;
    const ERROR = 'some error';

    dataCache.onError({ id: ID, resolution: RESOLUTION, error: ERROR });
    const state = dataCache.getState() as any;

    expect(state[ID][RESOLUTION]).toEqual(
      expect.objectContaining({
        error: ERROR,
      })
    );
  });

  it('onSuccess works', () => {
    const dataCache = new DataCache();

    dataCache.onSuccess({ onlyFetchLatestValue: false, viewport: { duration: SECOND_IN_MS } })([DATA_STREAM]);
    const state = dataCache.getState() as any;

    expect(state[DATA_STREAM.id][DATA_STREAM.resolution]).toBeDefined();
  });
});
