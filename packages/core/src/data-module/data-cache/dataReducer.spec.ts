import { DataPoint, DataType } from '@synchro-charts/core';
import { dataReducer } from './dataReducer';
import { onErrorAction, onRequestAction, onSuccessAction } from './dataActions';
import { DataStreamsStore } from './types';
import { getDataStreamStore } from './getDataStreamStore';
import { EMPTY_CACHE } from './caching/caching';
import { DAY_IN_MS, SECOND_IN_MS } from '../../common/time';
import { DataStream } from '../types';

const FIRST_DATE = new Date(2000, 0, 0);
const LAST_DATE = new Date(2001, 0, 0);

const DATE_NOW = new Date(2001, 0, 2);
const DATE_BEFORE = new Date(2000, 11, 0);

beforeEach(() => {
  jest.spyOn(Date, 'now').mockImplementation(() => DATE_NOW.getTime());
});

describe('loading status', () => {
  it('maintains `isLoading`, when requesting while already true', () => {
    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    const requestState = dataReducer(
      {}, // Empty original state
      onRequestAction({
        id: ID,
        resolution: '1s',
        start: FIRST_DATE,
        end: LAST_DATE,
        fetchFromStartToEnd: true,
      })
    );

    const reRequestState = dataReducer(
      requestState,
      onRequestAction({
        id: ID,
        resolution: '1s',
        start: FIRST_DATE,
        end: LAST_DATE,
        fetchFromStartToEnd: true,
      })
    );

    expect(reRequestState?.[ID]?.[RESOLUTION]).toEqual(
      expect.objectContaining({
        isLoading: true,
      })
    );
  });

  it('sets `isLoading` to false when error occurs', () => {
    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    const requestState = dataReducer(
      {}, // Empty original state
      onRequestAction({
        id: ID,
        resolution: '1s',
        start: FIRST_DATE,
        end: LAST_DATE,
        fetchFromStartToEnd: true,
      })
    );

    const errorState = dataReducer(
      requestState,
      onErrorAction(ID, RESOLUTION, {
        msg: 'some-error',
        type: 'ResourceNotFoundException',
        status: '404',
      })
    );

    expect(errorState?.[ID]?.[RESOLUTION]).toEqual(
      expect.objectContaining({
        isLoading: false,
      })
    );
  });

  it('sets `isLoading` to true when had an empty original state', () => {
    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    const afterRequestState = dataReducer(
      {}, // Empty original state
      onRequestAction({
        id: ID,
        resolution: '1s',
        start: FIRST_DATE,
        end: LAST_DATE,
        fetchFromStartToEnd: true,
      })
    );

    expect(afterRequestState?.[ID]?.[RESOLUTION]).toEqual(
      expect.objectContaining({
        isLoading: true,
      })
    );
  });

  it('does not set `isLoading` to true when there have been previous requests', () => {
    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    const requestInformation = {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchFromStartToEnd: true,
    };

    const state1 = dataReducer(
      {}, // Empty original state
      onRequestAction(requestInformation)
    );

    const state2 = dataReducer(
      state1,
      onSuccessAction(
        ID,
        {
          id: ID,
          name: 'some name',
          resolution: RESOLUTION,
          dataType: DataType.NUMBER,
          data: [], // Empty results,
        },
        FIRST_DATE,
        LAST_DATE,
        requestInformation
      )
    );

    const state3 = dataReducer(
      state2,
      onRequestAction({
        id: ID,
        resolution: '1s',
        start: new Date(LAST_DATE.getTime() + DAY_IN_MS),
        end: new Date(LAST_DATE.getTime() + 2 * DAY_IN_MS),
        fetchFromStartToEnd: true,
      })
    );

    // Even though there is no data present and data is refreshing, we are not showing as `isLoading`.
    expect(state3?.[ID]?.[RESOLUTION]).toEqual(
      expect.objectContaining({
        isLoading: false,
      })
    );
  });

  it('sets `isLoading` to false after first successful response', () => {
    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    const requestInformation = {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchFromStartToEnd: true,
    };

    const state1 = dataReducer(
      {}, // Empty original state
      onRequestAction(requestInformation)
    );

    const successState = dataReducer(
      state1,
      onSuccessAction(
        ID,
        {
          id: ID,
          name: 'some name',
          resolution: RESOLUTION,
          dataType: DataType.NUMBER,
          data: [], // Empty results
        },
        FIRST_DATE,
        LAST_DATE,
        requestInformation
      )
    );

    expect(successState?.[ID]?.[RESOLUTION]).toEqual(
      expect.objectContaining({
        isLoading: false,
      })
    );
  });
});

describe('on request', () => {
  describe('error status', () => {
    it('retains existing error message', () => {
      const ID = 'some-id';
      const RESOLUTION = SECOND_IN_MS;
      const ERR = { msg: 'a terrible error', type: 'ResourceNotFoundException', status: '404' };

      const INITIAL_STATE: DataStreamsStore = {
        [ID]: {
          [RESOLUTION]: {
            id: ID,
            resolution: RESOLUTION,
            error: ERR,
            isLoading: false,
            isRefreshing: false,
            requestHistory: [],
            dataCache: EMPTY_CACHE,
            requestCache: EMPTY_CACHE,
          },
        },
      };

      const afterRequestState = dataReducer(
        INITIAL_STATE,
        onRequestAction({
          id: ID,
          resolution: '1s',
          start: FIRST_DATE,
          end: LAST_DATE,
          fetchFromStartToEnd: true,
        })
      );

      expect(afterRequestState?.[ID]?.[RESOLUTION]).toEqual(
        expect.objectContaining({
          error: ERR,
        })
      );
    });
  });
});

it('returns the state back directly when a non-existent action type is passed in', () => {
  const INITIAL_STATE = {};
  expect(dataReducer(INITIAL_STATE, { type: 'fake-action' } as never)).toBe(INITIAL_STATE);
  // Reducers should not alter the reference or structure of the state if no action is to be applied.
  // This helps prevent accidental re-renders, since re-rendering is done based on referential equality.
  expect(INITIAL_STATE).toEqual({});
});

it('sets an error message for a previously loaded state', () => {
  const ID = 'my-id';
  const ERROR = { msg: 'my-error!', type: 'ResourceNotFoundException', status: '404' };
  const INITIAL_STATE: DataStreamsStore = {
    [ID]: {
      0: {
        id: ID,
        resolution: 0,
        isLoading: true,
        isRefreshing: true,
        requestHistory: [
          {
            start: FIRST_DATE,
            end: LAST_DATE,
            requestedAt: DATE_NOW,
          },
        ],
        dataCache: {
          intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
          items: [
            [
              {
                x: new Date(2000, 0, 0).getTime(),
                y: 0,
              },
            ],
          ],
        },
        requestCache: {
          items: [[]],
          intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
        },
      },
    },
  };
  const newState = dataReducer(INITIAL_STATE, onErrorAction(ID, 0, ERROR));
  expect(newState?.[ID]?.[0]).toEqual(
    expect.objectContaining({
      isLoading: false,
      isRefreshing: false,
      error: ERROR,
    })
  );
});

it('sets the data when a success action occurs with aggregated data', () => {
  const ID = 'my-id';
  const RESOLUTION = SECOND_IN_MS;

  const INITIAL_STATE = {
    [ID]: {
      [RESOLUTION]: {
        id: ID,
        resolution: RESOLUTION,
        isLoading: true,
        isRefreshing: true,
        requestHistory: [],
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
      },
    },
  };

  const aggregatedDataPoints = [{ x: Date.now(), y: 100 }];
  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    data: [],
    aggregates: { [RESOLUTION]: aggregatedDataPoints },
    dataType: DataType.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
    })
  );
  expect(newState?.[ID]?.[RESOLUTION]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      error: undefined,
      isLoading: false,
      isRefreshing: false,
      requestHistory: [
        expect.objectContaining({
          end: expect.any(Date),
          requestedAt: expect.any(Date),
          start: expect.any(Date),
        }),
      ],
      dataCache: {
        intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
        items: [aggregatedDataPoints],
      },
      requestCache: expect.objectContaining({
        intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
      }),
    })
  );
});

it('sets the data when a success action occurs', () => {
  const ID = 'my-id';
  const RESOLUTION = SECOND_IN_MS;

  const INITIAL_STATE = {
    [ID]: {
      [RESOLUTION]: {
        id: ID,
        resolution: RESOLUTION,
        isLoading: true,
        isRefreshing: true,
        requestHistory: [],
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
      },
    },
  };

  const newDataPoints = [{ x: Date.now(), y: 100 }];

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    aggregates: {
      [RESOLUTION]: newDataPoints,
    },
    data: [],
    dataType: DataType.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
    })
  );
  expect(newState?.[ID]?.[RESOLUTION]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      error: undefined,
      isLoading: false,
      requestHistory: [
        expect.objectContaining({
          end: expect.any(Date),
          requestedAt: expect.any(Date),
          start: expect.any(Date),
        }),
      ],
      dataCache: {
        intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
        items: [newDataPoints],
      },
      requestCache: expect.objectContaining({
        intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
      }),
    })
  );
});

it('sets the data with the correct cache intervals when a success action occurs with fetchMostRecentBeforeStart', () => {
  const ID = 'my-id';
  const RESOLUTION = SECOND_IN_MS;

  const INITIAL_STATE = {
    [ID]: {
      [RESOLUTION]: {
        id: ID,
        resolution: RESOLUTION,
        isLoading: true,
        isRefreshing: true,
        requestHistory: [],
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
      },
    },
  };

  const newDataPoints = [{ x: DATE_BEFORE.getTime(), y: 100 }];

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    aggregates: {
      [RESOLUTION]: newDataPoints,
    },
    data: [],
    dataType: DataType.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchMostRecentBeforeStart: true,
    })
  );
  expect(newState?.[ID]?.[RESOLUTION]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      error: undefined,
      isLoading: false,
      requestHistory: [
        expect.objectContaining({
          end: expect.any(Date),
          requestedAt: expect.any(Date),
          start: expect.any(Date),
        }),
      ],
      dataCache: {
        intervals: [[DATE_BEFORE.getTime(), LAST_DATE.getTime()]],
        items: [newDataPoints],
      },
      requestCache: expect.objectContaining({
        intervals: [[DATE_BEFORE.getTime(), LAST_DATE.getTime()]],
      }),
    })
  );
});

it('sets the data with the correct cache intervals when a success action occurs with fetchMostRecentBeforeEnd', () => {
  const ID = 'my-id';
  const RESOLUTION = SECOND_IN_MS;

  const INITIAL_STATE = {
    [ID]: {
      [RESOLUTION]: {
        id: ID,
        resolution: RESOLUTION,
        isLoading: true,
        isRefreshing: true,
        requestHistory: [],
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
      },
    },
  };

  const newDataPoints = [{ x: DATE_BEFORE.getTime(), y: 100 }];

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    aggregates: {
      [RESOLUTION]: newDataPoints,
    },
    data: [],
    dataType: DataType.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchMostRecentBeforeEnd: true,
    })
  );
  expect(newState?.[ID]?.[RESOLUTION]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      error: undefined,
      isLoading: false,
      requestHistory: [
        expect.objectContaining({
          end: expect.any(Date),
          requestedAt: expect.any(Date),
          start: expect.any(Date),
        }),
      ],
      dataCache: {
        intervals: [[DATE_BEFORE.getTime(), LAST_DATE.getTime()]],
        items: [newDataPoints],
      },
      requestCache: expect.objectContaining({
        intervals: [[DATE_BEFORE.getTime(), LAST_DATE.getTime()]],
      }),
    })
  );
});

it('sets the data with the correct cache intervals when a success action occurs with fetchMostRecentBeforeStart if no data is returned', () => {
  const ID = 'my-id';
  const RESOLUTION = SECOND_IN_MS;

  const INITIAL_STATE = {
    [ID]: {
      [RESOLUTION]: {
        id: ID,
        resolution: RESOLUTION,
        isLoading: true,
        isRefreshing: true,
        requestHistory: [],
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
      },
    },
  };

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    data: [],
    dataType: DataType.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchMostRecentBeforeStart: true,
    })
  );
  expect(newState?.[ID]?.[RESOLUTION]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      error: undefined,
      isLoading: false,
      requestHistory: [
        expect.objectContaining({
          end: expect.any(Date),
          requestedAt: expect.any(Date),
          start: expect.any(Date),
        }),
      ],
      dataCache: {
        intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
        items: [[]],
      },
      requestCache: expect.objectContaining({
        intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
      }),
    })
  );
});

it('sets the data with the correct cache intervals when a success action occurs with fetchMostRecentBeforeEnd if no data is returned', () => {
  const ID = 'my-id';
  const RESOLUTION = SECOND_IN_MS;

  const INITIAL_STATE = {
    [ID]: {
      [RESOLUTION]: {
        id: ID,
        resolution: RESOLUTION,
        isLoading: true,
        isRefreshing: true,
        requestHistory: [],
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
      },
    },
  };

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    data: [],
    dataType: DataType.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchMostRecentBeforeEnd: true,
    })
  );
  expect(newState?.[ID]?.[RESOLUTION]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      error: undefined,
      isLoading: false,
      requestHistory: [
        expect.objectContaining({
          end: expect.any(Date),
          requestedAt: expect.any(Date),
          start: expect.any(Date),
        }),
      ],
      dataCache: {
        intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
        items: [[]],
      },
      requestCache: expect.objectContaining({
        intervals: [[FIRST_DATE.getTime(), LAST_DATE.getTime()]],
      }),
    })
  );
});

it('merges data into existing data cache', () => {
  const ID = 'my-id';

  const DATE_ONE = new Date(2000, 0, 0).getTime();
  const DATE_TWO = new Date(2001, 0, 0).getTime();
  const DATA_POINTS_ONE: DataPoint[] = [
    { x: new Date(2000, 4, 0).getTime(), y: 100 },
    { x: new Date(2000, 8, 0).getTime(), y: 100 },
  ];

  const DATE_THREE = new Date(2003, 0, 0).getTime();
  const DATE_FOUR = new Date(2004, 0, 0).getTime();
  const DATA_POINTS_TWO: DataPoint[] = [
    { x: new Date(2003, 4, 0).getTime(), y: 100 },
    { x: new Date(2003, 8, 0).getTime(), y: 100 },
  ];

  const INITIAL_STATE: DataStreamsStore = {
    [ID]: {
      [SECOND_IN_MS]: {
        id: ID,
        resolution: SECOND_IN_MS,
        isLoading: true,
        isRefreshing: true,
        requestHistory: [
          {
            start: new Date(2000, 0, 0),
            end: new Date(2001, 0, 0),
            requestedAt: new Date(2001, 0, 0),
          },
        ],
        dataCache: {
          intervals: [
            [DATE_ONE, DATE_TWO],
            [DATE_THREE, DATE_FOUR],
          ],
          items: [DATA_POINTS_ONE, DATA_POINTS_TWO],
        },
        requestCache: {
          intervals: [
            [DATE_ONE, DATE_TWO],
            [DATE_THREE, DATE_FOUR],
          ],
          items: [[]],
        },
      },
    },
  };

  const NEWER_DATA_POINT_1 = { x: new Date(2002, 6, 0).getTime(), y: 400 };
  const OLDER_DATA_POINT_2 = { x: new Date(2002, 0, 0).getTime(), y: 600 };

  const dataStream = {
    name: 'some name',
    id: ID,
    aggregates: {
      [SECOND_IN_MS]: [NEWER_DATA_POINT_1, OLDER_DATA_POINT_2],
    },
    data: [],
    resolution: SECOND_IN_MS,
    dataType: DataType.NUMBER,
  };

  const START_DATE_1 = new Date(2000, 8, 0);
  const END_DATE_1 = new Date(DATE_THREE);

  const successState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, dataStream, START_DATE_1, END_DATE_1, {
      id: ID,
      resolution: '1s',
      start: START_DATE_1,
      end: END_DATE_1,
    })
  );

  expect(getDataStreamStore(ID, SECOND_IN_MS, successState)).toEqual({
    ...getDataStreamStore(ID, SECOND_IN_MS, INITIAL_STATE),
    isLoading: false,
    isRefreshing: false,
    id: ID,
    error: undefined,
    dataCache: {
      intervals: [[DATE_ONE, DATE_FOUR]],
      items: [[...DATA_POINTS_ONE, OLDER_DATA_POINT_2, NEWER_DATA_POINT_1, ...DATA_POINTS_TWO]],
    },
    requestCache: expect.objectContaining({
      intervals: [[DATE_ONE, DATE_FOUR]],
    }),
    requestHistory: expect.any(Array),
  });

  const BEFORE_START_DATA_POINT = { x: new Date(1990, 11, 0).getTime(), y: 500 };

  const beforeStartDataStream = {
    name: 'some name',
    id: ID,
    aggregates: {
      [SECOND_IN_MS]: [BEFORE_START_DATA_POINT],
    },
    data: [],
    resolution: SECOND_IN_MS,
    dataType: DataType.NUMBER,
  };

  const START_DATE_2 = new Date(1999, 0, 0);
  const END_DATE_2 = new Date(DATE_ONE);

  const beforeStartSuccessState = dataReducer(
    successState,
    onSuccessAction(ID, beforeStartDataStream, START_DATE_2, END_DATE_2, {
      id: ID,
      resolution: '1s',
      start: START_DATE_2,
      end: END_DATE_2,
      fetchMostRecentBeforeStart: true,
    })
  );

  expect(getDataStreamStore(ID, SECOND_IN_MS, beforeStartSuccessState)).toEqual({
    ...getDataStreamStore(ID, SECOND_IN_MS, successState),
    isLoading: false,
    isRefreshing: false,
    id: ID,
    error: undefined,
    dataCache: {
      intervals: [[BEFORE_START_DATA_POINT.x, DATE_FOUR]],
      items: [
        [BEFORE_START_DATA_POINT, ...DATA_POINTS_ONE, OLDER_DATA_POINT_2, NEWER_DATA_POINT_1, ...DATA_POINTS_TWO],
      ],
    },
    requestCache: expect.objectContaining({
      intervals: [[BEFORE_START_DATA_POINT.x, DATE_FOUR]],
    }),
    requestHistory: expect.any(Array),
  });
});

describe('requests to different resolutions', () => {
  it('it leaves existing resolution untouched on success, registering different resolution separately', () => {
    const ID = 'my-id';
    const INITIAL_STATE = {
      [ID]: {
        [SECOND_IN_MS]: {
          id: ID,
          resolution: SECOND_IN_MS,
          isLoading: true,
          isRefreshing: true,
          dataCache: EMPTY_CACHE,
          requestCache: EMPTY_CACHE,
          requestHistory: [],
        },
      },
    };
    const NEW_FIRST_DATE = new Date(2000, 0, 0);
    const NEW_LAST_DATE = new Date(2001, 0, 0);

    const newDataPoints = [{ x: new Date(2000, 0, 0).getTime(), y: 100 }];

    const DATA: DataStream = {
      id: ID,
      name: 'some name',
      resolution: SECOND_IN_MS / 2,
      aggregates: {
        [SECOND_IN_MS / 2]: newDataPoints,
      },
      data: [],
      dataType: DataType.NUMBER,
    };

    const requestInformation = {
      id: ID,
      resolution: '500ms',
      start: NEW_FIRST_DATE,
      end: NEW_LAST_DATE,
      fetchFromStartToEnd: true,
    };

    const requestState = dataReducer(INITIAL_STATE, onRequestAction(requestInformation));
    const newState = dataReducer(
      requestState,
      onSuccessAction(ID, DATA, NEW_FIRST_DATE, NEW_LAST_DATE, requestInformation)
    );
    expect(newState).toEqual({
      [ID]: {
        [SECOND_IN_MS / 2]: {
          id: ID,
          resolution: SECOND_IN_MS / 2,
          isLoading: false,
          isRefreshing: false,
          error: undefined,
          requestHistory: [
            {
              start: NEW_FIRST_DATE,
              end: NEW_LAST_DATE,
              requestedAt: DATE_NOW,
            },
          ],
          dataCache: {
            intervals: [[NEW_FIRST_DATE.getTime(), NEW_LAST_DATE.getTime()]],
            items: [newDataPoints],
          },
          requestCache: {
            intervals: [[NEW_FIRST_DATE.getTime(), NEW_LAST_DATE.getTime()]],
            items: [[]],
          },
        },
        [SECOND_IN_MS]: INITIAL_STATE[ID][SECOND_IN_MS],
      },
    });
  });

  it('it leaves existing resolution untouched on error, registering different resolution separately', () => {
    const ID = 'my-id';
    const INITIAL_STATE = {
      [ID]: {
        [SECOND_IN_MS]: {
          id: ID,
          resolution: SECOND_IN_MS,
          isLoading: true,
          isRefreshing: true,
          dataCache: EMPTY_CACHE,
          requestCache: EMPTY_CACHE,
          requestHistory: [],
        },
      },
    };
    const NEW_FIRST_DATE = new Date(2000, 0, 0);
    const NEW_LAST_DATE = new Date(2001, 0, 0);
    const RESOLUTION = SECOND_IN_MS / 2;

    const requestInformation = {
      id: ID,
      resolution: '500ms',
      start: NEW_FIRST_DATE,
      end: NEW_LAST_DATE,
      fetchFromStartToEnd: true,
    };
    const requestState = dataReducer(INITIAL_STATE, onRequestAction(requestInformation));
    const ERROR = { msg: 'error!', type: 'ResourceNotFoundException', status: '404' };
    const newState = dataReducer(requestState, onErrorAction(ID, RESOLUTION, ERROR));

    // maintained other resolution
    expect(newState?.[ID]?.[SECOND_IN_MS]).toBe(INITIAL_STATE[ID][SECOND_IN_MS]);

    expect(newState?.[ID]?.[RESOLUTION]).toEqual({
      id: ID,
      resolution: RESOLUTION,
      error: ERROR,
      isLoading: false,
      isRefreshing: false,
      requestHistory: [
        {
          start: NEW_FIRST_DATE,
          end: NEW_LAST_DATE,
          requestedAt: DATE_NOW,
        },
      ],
      dataCache: EMPTY_CACHE,
      requestCache: {
        intervals: [[NEW_FIRST_DATE.getTime(), NEW_LAST_DATE.getTime()]],
        items: [[]],
      },
    });
  });
});
