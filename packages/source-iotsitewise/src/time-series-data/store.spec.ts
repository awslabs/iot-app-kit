import { CreateTimeSeriesDataStore } from './store';
import { TIME_SERIES_DATA_WITH_ALARMS } from '../__mocks__/alarm';
import { YAnnotation } from '@synchro-charts/core';

describe('TimeSeriesDataStore', () => {
  const initStore = () => {
    const initialState = {
      dataStreams: [],
      annotations: {},
      assetModels: {},
      alarms: {},
      errors: {},
    };

    const callback = jest.fn();

    const store = new CreateTimeSeriesDataStore({ initialState, callback });

    return { store, initialState, callback };
  };

  it('can create a time series store', () => {
    const { store, initialState } = initStore();

    expect(store.getState()).toEqual(initialState);

    // should not mutate init state
    expect(store.getState()).not.toBe(initialState);
  });

  it('can append time series data', () => {
    const { store, initialState } = initStore();

    expect(store.getState()).toEqual(initialState);

    store.appendTimeSeriesData(TIME_SERIES_DATA_WITH_ALARMS);

    expect(store.getState()).toEqual(expect.objectContaining(TIME_SERIES_DATA_WITH_ALARMS));
  });

  it('will correctly append dataStreams', () => {
    const { store } = initStore();

    const NEW_ALARM_STREAM = {
      dataStreams: [
        {
          ...TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0],
          id: 'asset---new-alarm',
        },
      ],
    };

    store.appendTimeSeriesData(TIME_SERIES_DATA_WITH_ALARMS);
    store.appendTimeSeriesData(NEW_ALARM_STREAM);

    expect(store.getState().dataStreams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0].id,
          data: TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0].data,
        }),
        expect.objectContaining({
          id: NEW_ALARM_STREAM.dataStreams[0].id,
          data: NEW_ALARM_STREAM.dataStreams[0].data,
        }),
      ])
    );

    const UPDATE_DATA = {
      ...TIME_SERIES_DATA_WITH_ALARMS,
      dataStreams: [
        {
          ...TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0],
          data: [
            {
              x: 3000000,
              y: 'Normal',
            },
            {
              x: 4000000,
              y: 'Latched',
            },
          ],
        },
      ],
    };

    store.appendTimeSeriesData(UPDATE_DATA);

    expect(store.getState().dataStreams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: TIME_SERIES_DATA_WITH_ALARMS.dataStreams[0].id,
          data: UPDATE_DATA.dataStreams[0].data,
        }),
      ])
    );
  });

  it('will correctly append annotations', () => {
    const { store } = initStore();

    store.appendTimeSeriesData(TIME_SERIES_DATA_WITH_ALARMS);

    expect(store.getState().annotations).toEqual(TIME_SERIES_DATA_WITH_ALARMS.annotations);

    const NEW_ANNOTATIONS = {
      annotations: {
        y: [
          {
            color: 'blue',
            comparisonOperator: 'LT',
            description: 'test',
            severity: 2,
            value: 10,
          },
        ],
      },
    };

    store.appendTimeSeriesData(NEW_ANNOTATIONS);

    expect(store.getState().annotations.y).toEqual([
      ...(TIME_SERIES_DATA_WITH_ALARMS.annotations.y as YAnnotation[]),
      ...NEW_ANNOTATIONS.annotations.y,
    ]);
  });
});
