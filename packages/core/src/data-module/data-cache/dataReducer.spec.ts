import { dataReducer } from './dataReducer';
import { onErrorAction, onRequestAction, onSuccessAction } from './dataActions';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { getDataStreamStore } from './getDataStreamStore';
import { EMPTY_CACHE } from './caching/caching';
import { DAY_IN_MS, SECOND_IN_MS } from '../../common/time';
import { DATA_TYPE } from '../../common/constants';
import type { DataPoint, DataStream } from '../types';
import type { DataStreamsStore } from './types';

const FIRST_DATE = new Date(2000, 0, 0);
const LAST_DATE = new Date(2001, 0, 0);

const DATE_NOW = new Date(2001, 0, 2);
const DATE_BEFORE = new Date(2000, 11, 0);

const AGGREGATE_TYPE = AggregateType.AVERAGE;

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
        aggregationType: AGGREGATE_TYPE,
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
        aggregationType: AGGREGATE_TYPE,
      })
    );

    expect(
      reRequestState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]
    ).toEqual(
      expect.objectContaining({
        isLoading: true,
        aggregationType: AGGREGATE_TYPE,
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
        aggregationType: AGGREGATE_TYPE,
      })
    );

    const errorState = dataReducer(
      requestState,
      onErrorAction(
        ID,
        RESOLUTION,
        {
          msg: 'some-error',
          type: 'ResourceNotFoundException',
          status: '404',
        },
        AGGREGATE_TYPE
      )
    );

    expect(
      errorState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]
    ).toEqual(
      expect.objectContaining({
        isLoading: false,
        aggregationType: AGGREGATE_TYPE,
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
        aggregationType: AGGREGATE_TYPE,
      })
    );

    expect(
      afterRequestState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]
    ).toEqual(
      expect.objectContaining({
        isLoading: true,
        aggregationType: AGGREGATE_TYPE,
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
      aggregationType: AGGREGATE_TYPE,
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
          dataType: DATA_TYPE.NUMBER,
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
        aggregationType: AGGREGATE_TYPE,
        fetchFromStartToEnd: true,
      })
    );

    // Even though there is no data present and data is refreshing, we are not showing as `isLoading`.
    expect(state3?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
      expect.objectContaining({
        isLoading: false,
        aggregationType: AGGREGATE_TYPE,
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
      aggregationType: AGGREGATE_TYPE,
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
          dataType: DATA_TYPE.NUMBER,
          data: [], // Empty results
        },
        FIRST_DATE,
        LAST_DATE,
        requestInformation
      )
    );

    expect(
      successState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]
    ).toEqual(
      expect.objectContaining({
        isLoading: false,
        aggregationType: AGGREGATE_TYPE,
      })
    );
  });
});

describe('on request', () => {
  describe('error status', () => {
    it('retains existing error message', () => {
      const ID = 'some-id';
      const RESOLUTION = SECOND_IN_MS;
      const ERR = {
        msg: 'a terrible error',
        type: 'ResourceNotFoundException',
        status: '404',
      };

      const INITIAL_STATE: DataStreamsStore = {
        [ID]: {
          resolutions: {
            [RESOLUTION]: {
              [AGGREGATE_TYPE]: {
                id: ID,
                resolution: RESOLUTION,
                error: ERR,
                isLoading: false,
                isRefreshing: false,
                requestHistory: [],
                dataCache: EMPTY_CACHE,
                aggregationType: AGGREGATE_TYPE,
                requestCache: EMPTY_CACHE,
              },
            },
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
          aggregationType: AGGREGATE_TYPE,
        })
      );

      expect(
        afterRequestState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]
      ).toEqual(
        expect.objectContaining({
          error: ERR,
          aggregationType: AGGREGATE_TYPE,
        })
      );
    });
  });
});

it('returns the state back directly when a non-existent action type is passed in', () => {
  const INITIAL_STATE = {};
  expect(dataReducer(INITIAL_STATE, { type: 'fake-action' } as never)).toBe(
    INITIAL_STATE
  );
  // Reducers should not alter the reference or structure of the state if no action is to be applied.
  // This helps prevent accidental re-renders, since re-rendering is done based on referential equality.
  expect(INITIAL_STATE).toEqual({});
});

it('sets an error message for a previously loaded state', () => {
  const ID = 'my-id';
  const ERROR = {
    msg: 'my-error!',
    type: 'ResourceNotFoundException',
    status: '404',
  };
  const INITIAL_STATE: DataStreamsStore = {
    [ID]: {
      rawData: {
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
  expect(newState?.[ID]?.rawData).toEqual(
    expect.objectContaining({
      isLoading: false,
      isRefreshing: false,
      resolution: 0,
      error: ERROR,
    })
  );
});

it('sets the data when a success action occurs with aggregated data', () => {
  const ID = 'my-id';
  const RESOLUTION = SECOND_IN_MS;

  const INITIAL_STATE = {
    [ID]: {
      resolutions: {
        [RESOLUTION]: {
          [AGGREGATE_TYPE]: {
            id: ID,
            resolution: RESOLUTION,
            isLoading: true,
            isRefreshing: true,
            requestHistory: [],
            dataCache: EMPTY_CACHE,
            requestCache: EMPTY_CACHE,
            aggregationType: AGGREGATE_TYPE,
            numOutgoingRequests: 0,
          },
        },
      },
    },
  };

  const aggregatedDataPoints = [{ x: Date.now(), y: 100 }];
  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    aggregationType: AGGREGATE_TYPE,
    data: aggregatedDataPoints,
    dataType: DATA_TYPE.NUMBER,
    isRefreshing: true,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      aggregationType: AGGREGATE_TYPE,
    })
  );
  expect(newState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      aggregationType: AGGREGATE_TYPE,
      error: undefined,
      isLoading: false,
      isRefreshing: false,
      numOutgoingRequests: -1,
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
      resolutions: {
        [RESOLUTION]: {
          [AGGREGATE_TYPE]: {
            id: ID,
            resolution: RESOLUTION,
            isLoading: true,
            isRefreshing: true,
            requestHistory: [],
            dataCache: EMPTY_CACHE,
            requestCache: EMPTY_CACHE,
            aggregationType: AGGREGATE_TYPE,
          },
        },
      },
    },
  };

  const newDataPoints = [{ x: Date.now(), y: 100 }];

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    data: newDataPoints,
    aggregationType: AGGREGATE_TYPE,
    dataType: DATA_TYPE.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      aggregationType: AGGREGATE_TYPE,
    })
  );
  expect(newState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      aggregationType: AGGREGATE_TYPE,
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
      resolutions: {
        [RESOLUTION]: {
          [AGGREGATE_TYPE]: {
            id: ID,
            resolution: RESOLUTION,
            isLoading: true,
            isRefreshing: true,
            requestHistory: [],
            dataCache: EMPTY_CACHE,
            requestCache: EMPTY_CACHE,
            aggregationType: AGGREGATE_TYPE,
          },
        },
      },
    },
  };

  const newDataPoints = [{ x: DATE_BEFORE.getTime(), y: 100 }];

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    aggregationType: AGGREGATE_TYPE,
    data: newDataPoints,
    dataType: DATA_TYPE.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchMostRecentBeforeStart: true,
      aggregationType: AGGREGATE_TYPE,
    })
  );
  expect(newState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      aggregationType: AGGREGATE_TYPE,
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
      resolutions: {
        [RESOLUTION]: {
          [AGGREGATE_TYPE]: {
            id: ID,
            resolution: RESOLUTION,
            isLoading: true,
            isRefreshing: true,
            requestHistory: [],
            dataCache: EMPTY_CACHE,
            requestCache: EMPTY_CACHE,
            aggregationType: AGGREGATE_TYPE,
          },
        },
      },
    },
  };

  const newDataPoints = [{ x: DATE_BEFORE.getTime(), y: 100 }];

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    aggregationType: AGGREGATE_TYPE,
    data: newDataPoints,
    dataType: DATA_TYPE.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchMostRecentBeforeEnd: true,
      aggregationType: AGGREGATE_TYPE,
    })
  );
  expect(newState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      aggregationType: AGGREGATE_TYPE,
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
      resolutions: {
        [RESOLUTION]: {
          [AGGREGATE_TYPE]: {
            id: ID,
            resolution: RESOLUTION,
            isLoading: true,
            isRefreshing: true,
            requestHistory: [],
            dataCache: EMPTY_CACHE,
            requestCache: EMPTY_CACHE,
            aggregationType: AGGREGATE_TYPE,
          },
        },
      },
    },
  };

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    data: [],
    dataType: DATA_TYPE.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchMostRecentBeforeStart: true,
      aggregationType: AGGREGATE_TYPE,
    })
  );
  expect(newState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      aggregationType: AGGREGATE_TYPE,
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
      resolutions: {
        [RESOLUTION]: {
          [AGGREGATE_TYPE]: {
            id: ID,
            resolution: RESOLUTION,
            isLoading: true,
            isRefreshing: true,
            requestHistory: [],
            dataCache: EMPTY_CACHE,
            requestCache: EMPTY_CACHE,
            aggregationType: AGGREGATE_TYPE,
          },
        },
      },
    },
  };

  const DATA: DataStream = {
    id: ID,
    name: 'some name',
    resolution: RESOLUTION,
    data: [],
    dataType: DATA_TYPE.NUMBER,
  };
  const newState = dataReducer(
    INITIAL_STATE,
    onSuccessAction(ID, DATA, FIRST_DATE, LAST_DATE, {
      id: ID,
      resolution: '1s',
      start: FIRST_DATE,
      end: LAST_DATE,
      fetchMostRecentBeforeEnd: true,
      aggregationType: AGGREGATE_TYPE,
    })
  );
  expect(newState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
    expect.objectContaining({
      id: ID,
      resolution: RESOLUTION,
      aggregationType: AGGREGATE_TYPE,
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
      resolutions: {
        [SECOND_IN_MS]: {
          [AGGREGATE_TYPE]: {
            id: ID,
            resolution: SECOND_IN_MS,
            isLoading: true,
            isRefreshing: true,
            numOutgoingRequests: 0,
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
            aggregationType: AGGREGATE_TYPE,
          },
        },
      },
    },
  };

  const NEWER_DATA_POINT_1 = { x: new Date(2002, 6, 0).getTime(), y: 400 };
  const OLDER_DATA_POINT_2 = { x: new Date(2002, 0, 0).getTime(), y: 600 };

  const dataStream = {
    name: 'some name',
    id: ID,
    aggregationType: AGGREGATE_TYPE,
    data: [NEWER_DATA_POINT_1, OLDER_DATA_POINT_2],
    resolution: SECOND_IN_MS,
    dataType: DATA_TYPE.NUMBER,
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
      aggregationType: AGGREGATE_TYPE,
    })
  );

  expect(
    getDataStreamStore(ID, SECOND_IN_MS, successState, AGGREGATE_TYPE)
  ).toEqual({
    ...getDataStreamStore(ID, SECOND_IN_MS, INITIAL_STATE, AGGREGATE_TYPE),
    isLoading: false,
    isRefreshing: false,
    id: ID,
    dataType: 'NUMBER',
    name: 'some name',
    error: undefined,
    numOutgoingRequests: -1,
    dataCache: {
      intervals: [[DATE_ONE, DATE_FOUR]],
      items: [
        [
          ...DATA_POINTS_ONE,
          OLDER_DATA_POINT_2,
          NEWER_DATA_POINT_1,
          ...DATA_POINTS_TWO,
        ],
      ],
    },
    requestCache: expect.objectContaining({
      intervals: [[DATE_ONE, DATE_FOUR]],
    }),
    requestHistory: expect.any(Array),
  });

  const BEFORE_START_DATA_POINT = {
    x: new Date(1990, 11, 0).getTime(),
    y: 500,
  };

  const beforeStartDataStream = {
    name: 'some name',
    id: ID,
    data: [BEFORE_START_DATA_POINT],
    resolution: SECOND_IN_MS,
    dataType: DATA_TYPE.NUMBER,
    aggregationType: AGGREGATE_TYPE,
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
      aggregationType: AGGREGATE_TYPE,
    })
  );

  expect(
    getDataStreamStore(
      ID,
      SECOND_IN_MS,
      beforeStartSuccessState,
      AGGREGATE_TYPE
    )
  ).toEqual({
    ...getDataStreamStore(ID, SECOND_IN_MS, successState, AGGREGATE_TYPE),
    isLoading: false,
    isRefreshing: false,
    id: ID,
    error: undefined,
    dataCache: {
      intervals: [[BEFORE_START_DATA_POINT.x, DATE_FOUR]],
      items: [
        [
          BEFORE_START_DATA_POINT,
          ...DATA_POINTS_ONE,
          OLDER_DATA_POINT_2,
          NEWER_DATA_POINT_1,
          ...DATA_POINTS_TWO,
        ],
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
        resolutions: {
          [SECOND_IN_MS]: {
            [AGGREGATE_TYPE]: {
              id: ID,
              resolution: SECOND_IN_MS,
              isLoading: true,
              isRefreshing: true,
              dataCache: EMPTY_CACHE,
              requestCache: EMPTY_CACHE,
              requestHistory: [],
              aggregationType: AGGREGATE_TYPE,
              numOutgoingRequests: 0,
            },
          },
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
      data: newDataPoints,
      dataType: DATA_TYPE.NUMBER,
      aggregationType: AGGREGATE_TYPE,
    };

    const requestInformation = {
      id: ID,
      resolution: '500ms',
      start: NEW_FIRST_DATE,
      end: NEW_LAST_DATE,
      getDataStreamStore,
      fetchFromStartToEnd: true,
      aggregationType: AGGREGATE_TYPE,
    };

    const requestState = dataReducer(
      INITIAL_STATE,
      onRequestAction(requestInformation)
    );
    const newState = dataReducer(
      requestState,
      onSuccessAction(
        ID,
        DATA,
        NEW_FIRST_DATE,
        NEW_LAST_DATE,
        requestInformation
      )
    );
    expect(newState).toEqual({
      [ID]: {
        resolutions: {
          [SECOND_IN_MS / 2]: {
            [AGGREGATE_TYPE]: {
              id: ID,
              resolution: SECOND_IN_MS / 2,
              aggregationType: AGGREGATE_TYPE,
              isLoading: false,
              isRefreshing: false,
              numOutgoingRequests: -1,
              error: undefined,
              dataType: 'NUMBER',
              name: 'some name',
              requestHistory: [
                {
                  start: NEW_FIRST_DATE,
                  end: NEW_LAST_DATE,
                  requestedAt: DATE_NOW,
                },
              ],
              dataCache: {
                intervals: [
                  [NEW_FIRST_DATE.getTime(), NEW_LAST_DATE.getTime()],
                ],
                items: [newDataPoints],
              },
              requestCache: {
                intervals: [
                  [NEW_FIRST_DATE.getTime(), NEW_LAST_DATE.getTime()],
                ],
                items: [[]],
              },
            },
          },
          [SECOND_IN_MS]: {
            [AGGREGATE_TYPE]:
              INITIAL_STATE[ID]['resolutions'][SECOND_IN_MS][AGGREGATE_TYPE],
          },
        },
      },
    });
  });

  it('it leaves existing resolution untouched on error, registering different resolution separately', () => {
    const ID = 'my-id';
    const INITIAL_STATE = {
      [ID]: {
        resolutions: {
          [SECOND_IN_MS]: {
            [AGGREGATE_TYPE]: {
              id: ID,
              resolution: SECOND_IN_MS,
              isLoading: true,
              isRefreshing: true,
              dataCache: EMPTY_CACHE,
              requestCache: EMPTY_CACHE,
              requestHistory: [],
              aggregationType: AGGREGATE_TYPE,
              numOutgoingRequests: 0,
            },
          },
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
      aggregationType: AGGREGATE_TYPE,
    };
    const requestState = dataReducer(
      INITIAL_STATE,
      onRequestAction(requestInformation)
    );
    const ERROR = {
      msg: 'error!',
      type: 'ResourceNotFoundException',
      status: '404',
    };
    const newState = dataReducer(
      requestState,
      onErrorAction(ID, RESOLUTION, ERROR, AGGREGATE_TYPE)
    );

    // maintained other resolution
    expect(newState?.[ID]?.resolutions?.[SECOND_IN_MS]).toBe(
      INITIAL_STATE[ID]['resolutions'][SECOND_IN_MS]
    );

    expect(newState?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
      {
        id: ID,
        resolution: RESOLUTION,
        aggregationType: AGGREGATE_TYPE,
        error: ERROR,
        isLoading: false,
        isRefreshing: false,
        numOutgoingRequests: -1,
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
      }
    );
  });
});
