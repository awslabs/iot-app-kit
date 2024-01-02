import {
  onAddTrendCursor,
  onConnect,
  onDeleteTrendCursor,
  onDisconnect,
  onSetTrendCursorValues,
  onUpdateTrendCursor,
} from './actions';
import { reducer } from './reducer';
import { DEFAULT_TREND_CURSOR_DATA } from './state';

const stateWithDefault = (state?: Partial<ReturnType<typeof reducer>>) => ({
  ...DEFAULT_TREND_CURSOR_DATA,
  ...state,
});

describe('trend cursor store reducer', () => {
  it('can connect and disconnect an updater from a group', () => {
    const updater = () => {};
    let updated = reducer(stateWithDefault(), onConnect('group-1', updater));
    expect(updated).toEqual(
      expect.objectContaining({
        groups: { 'group-1': { connectedCharts: [updater], trendCursors: [] } },
      })
    );

    updated = reducer(
      stateWithDefault(updated),
      onDisconnect('group-1', updater)
    );
    expect(updated).toEqual(
      expect.objectContaining({
        groups: {
          'group-1': {
            connectedCharts: [],
            trendCursors: [],
          },
        },
      })
    );
  });

  it('can add and remove a trend cursor', () => {
    const updater = jest.fn();
    let updated = reducer(stateWithDefault(), onConnect('group-1', updater));

    const trendcursor = {
      id: 'trend-cursor-1',
      group: 'group-1',
      date: 0,
      color: 'black',
    };

    updated = reducer(stateWithDefault(updated), onAddTrendCursor(trendcursor));

    expect(updated).toEqual(
      expect.objectContaining({
        groups: {
          'group-1': {
            connectedCharts: [updater],
            trendCursors: ['trend-cursor-1'],
          },
        },
        trendCursors: {
          'trend-cursor-1': trendcursor,
        },
      })
    );

    expect(updater).toBeCalledWith([trendcursor], 'add');

    updated = reducer(
      stateWithDefault(updated),
      onDeleteTrendCursor(trendcursor)
    );

    expect(updated).toEqual(
      expect.objectContaining({
        groups: {
          'group-1': {
            connectedCharts: [updater],
            trendCursors: [],
          },
        },
        trendCursors: {},
      })
    );

    expect(updater).toBeCalledWith([], 'remove');
  });

  it('can update a trend cursor', () => {
    const updater = jest.fn();
    let updated = reducer(stateWithDefault(), onConnect('group-1', updater));

    const trendcursor = {
      id: 'trend-cursor-1',
      group: 'group-1',
      date: 0,
      color: 'black',
    };

    updated = reducer(stateWithDefault(updated), onAddTrendCursor(trendcursor));

    const updatedTrendCursor = { ...trendcursor, date: 10 };
    updated = reducer(
      stateWithDefault(updated),
      onUpdateTrendCursor(updatedTrendCursor)
    );

    expect(updated).toEqual(
      expect.objectContaining({
        trendCursors: {
          'trend-cursor-1': updatedTrendCursor,
        },
      })
    );

    expect(updater).toBeCalledWith([updatedTrendCursor], 'update');
  });

  it('can set a trend cursor value', () => {
    const trendcursor = {
      id: 'trend-cursor-1',
      group: 'group-1',
      date: 0,
      color: 'black',
    };

    let updated = reducer(stateWithDefault(), onAddTrendCursor(trendcursor));

    const trendCursorValue1 = {
      id: 'value-1',
      trendCursorId: 'trend-cursor-1',
      value: 10,
      name: 'datastream-1',
    };
    const trendCursorValue2 = {
      id: 'value-2',
      trendCursorId: 'trend-cursor-1',
      value: 20,
      name: 'datastream-2',
    };
    const trendCursorValues = [trendCursorValue1, trendCursorValue2];
    updated = reducer(
      stateWithDefault(updated),
      onSetTrendCursorValues(trendCursorValues)
    );

    expect(updated).toEqual(
      expect.objectContaining({
        trendCursorValues: {
          'trend-cursor-1': {
            [trendCursorValue1.id]: trendCursorValue1,
            [trendCursorValue2.id]: trendCursorValue2,
          },
        },
      })
    );
  });
});
