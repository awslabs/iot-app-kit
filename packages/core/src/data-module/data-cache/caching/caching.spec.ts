import { DataPoint } from '@synchro-charts/core';
import {
  addToDataPointCache,
  checkCacheForRecentPoint,
  createDataPointCache,
  EMPTY_CACHE,
  getDateRangesToRequest,
  unexpiredCacheIntervals,
  maxCacheDuration,
  getRequestInformations,
} from './caching';
import { DEFAULT_CACHE_SETTINGS } from '../../TimeSeriesDataModule';
import { HOUR_IN_MS, MINUTE_IN_MS, SECOND_IN_MS } from '../../../common/time';
import { DataStreamsStore } from '../types';
import { IntervalStructure } from '../../../common/intervalStructure';

const STREAM_ID = 'some-id';

describe('getDateRangesToRequest', () => {
  it('combines small intervals while still fracturing a request around a large gap', () => {
    const RESOLUTION = 0;
    const DATE = new Date(2000, 0, 0);

    const duration = 20 * MINUTE_IN_MS;
    const shortDuration = 10 * SECOND_IN_MS;

    // Causes a large 'gap' in the request, which we will not want to re-request
    const CACHED_START = new Date(DATE.getTime() - duration);
    const CACHED_END = new Date(DATE.getTime() + duration);

    // Causes a small 'gap' in the request, which we will want to re-request
    const SHORT_CACHE_CENTER = DATE.getTime() + duration * 1.5; // to the right enough to not intersect
    const SHORT_CACHE_START = new Date(SHORT_CACHE_CENTER - shortDuration);
    const SHORT_CACHE_END = new Date(SHORT_CACHE_CENTER + shortDuration);

    const REQUESTED_START = new Date(DATE.getTime() - 2 * duration);
    const REQUESTED_END = new Date(DATE.getTime() + 2 * duration);

    // cache with one interval
    const intermediateCache = createDataPointCache({
      start: CACHED_START,
      end: CACHED_END,
    });
    // cache with both intervals
    const requestCache = addToDataPointCache({
      start: SHORT_CACHE_START,
      end: SHORT_CACHE_END,
      cache: intermediateCache,
    });

    const store: DataStreamsStore = {
      [STREAM_ID]: {
        [RESOLUTION]: {
          id: STREAM_ID,
          resolution: RESOLUTION,
          isLoading: false,
          isRefreshing: false,
          requestHistory: [],
          dataCache: EMPTY_CACHE,
          requestCache,
        },
      },
    };

    expect(
      getDateRangesToRequest({
        store,
        resolution: RESOLUTION,
        dataStreamId: STREAM_ID,
        start: REQUESTED_START,
        end: REQUESTED_END,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      [REQUESTED_START, CACHED_START],
      [CACHED_END, REQUESTED_END],
    ]);
  });

  it('does fracture a request when the gap between the two requests is large', () => {
    const RESOLUTION = 0;
    const DATE = new Date(2000, 0, 0);

    const duration = 20 * MINUTE_IN_MS;
    const CACHED_START = new Date(DATE.getTime() - duration);
    const CACHED_END = new Date(DATE.getTime() + duration);
    const REQUESTED_START = new Date(DATE.getTime() - 2 * duration);
    const REQUESTED_END = new Date(DATE.getTime() + 2 * duration);

    const store: DataStreamsStore = {
      [STREAM_ID]: {
        [RESOLUTION]: {
          id: STREAM_ID,
          resolution: RESOLUTION,
          isLoading: false,
          isRefreshing: false,
          requestHistory: [],
          dataCache: EMPTY_CACHE,
          requestCache: createDataPointCache({
            start: CACHED_START,
            end: CACHED_END,
          }),
        },
      },
    };

    expect(
      getDateRangesToRequest({
        store,
        resolution: RESOLUTION,
        dataStreamId: STREAM_ID,
        start: REQUESTED_START,
        end: REQUESTED_END,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      [REQUESTED_START, CACHED_START],
      [CACHED_END, REQUESTED_END],
    ]);
  });
  it('does not fracture a request when the gap between the two requests would be small', () => {
    const RESOLUTION = 0;
    const DATE = new Date(2000, 0, 0);

    // The cached range is contained within the requested range, but the 'gap' is small,
    // So to avoid additional network requests to save a minimal amount of data being queried,
    // simply make one larger request
    const duration = 5 * SECOND_IN_MS;
    const CACHED_START = new Date(DATE.getTime() - duration);
    const CACHED_END = new Date(DATE.getTime() + duration);
    const REQUESTED_START = new Date(DATE.getTime() - 2 * duration);
    const REQUESTED_END = new Date(DATE.getTime() + 2 * duration);

    const store: DataStreamsStore = {
      [STREAM_ID]: {
        [RESOLUTION]: {
          id: STREAM_ID,
          resolution: RESOLUTION,
          isLoading: false,
          isRefreshing: false,
          requestHistory: [],
          dataCache: EMPTY_CACHE,
          requestCache: createDataPointCache({
            start: CACHED_START,
            end: CACHED_END,
          }),
        },
      },
    };

    expect(
      getDateRangesToRequest({
        store,
        resolution: RESOLUTION,
        dataStreamId: STREAM_ID,
        start: REQUESTED_START,
        end: REQUESTED_END,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([[REQUESTED_START, REQUESTED_END]]);
  });

  describe('determine whether the request should be initiated when there is an empty request history', () => {
    it('should fire request for full range if store is empty', () => {
      const START_DATE = new Date(2000, 0, 0);
      const END_DATE = new Date(2001, 0, 0);
      expect(
        getDateRangesToRequest({
          store: {},
          resolution: 0,
          dataStreamId: STREAM_ID,
          start: START_DATE,
          end: END_DATE,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).toEqual([[START_DATE, END_DATE]]);
    });

    it('should fire request when the date range does not overlap the request', () => {
      const START_DATE = new Date(2000, 0, 0);
      const END_DATE = new Date(2001, 0, 0);
      expect(
        getDateRangesToRequest({
          store: {
            [STREAM_ID]: {
              0: {
                id: STREAM_ID,
                resolution: 0,
                requestHistory: [],
                isLoading: false,
                isRefreshing: false,
                dataCache: EMPTY_CACHE,
                requestCache: createDataPointCache({
                  start: new Date(1998, 0, 0),
                  end: new Date(1999, 0, 0),
                }),
              },
            },
          },
          resolution: 0,
          dataStreamId: STREAM_ID,
          start: START_DATE,
          end: END_DATE,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).toEqual([[START_DATE, END_DATE]]);
    });

    it('should fire request when the date range partially overlaps the requested range', () => {
      expect(
        getDateRangesToRequest({
          store: {
            [STREAM_ID]: {
              0: {
                id: STREAM_ID,
                resolution: 0,
                isLoading: false,
                isRefreshing: false,
                requestHistory: [],
                dataCache: EMPTY_CACHE,
                requestCache: createDataPointCache({
                  start: new Date(1999, 0, 0),
                  end: new Date(2000, 0, 6),
                }),
              },
            },
          },
          dataStreamId: STREAM_ID,
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
          resolution: 0,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).toEqual([[new Date(2000, 0, 6), new Date(2001, 0, 0)]]);
    });

    it('should not fire request when the date range fully contains the requested date range', () => {
      expect(
        getDateRangesToRequest({
          store: {
            [STREAM_ID]: {
              0: {
                id: STREAM_ID,
                resolution: 0,
                isLoading: false,
                isRefreshing: false,
                requestHistory: [],
                dataCache: EMPTY_CACHE,
                requestCache: createDataPointCache({
                  start: new Date(1999, 0, 0),
                  end: new Date(2002, 0, 0),
                }),
              },
            },
          },
          dataStreamId: STREAM_ID,
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
          resolution: 0,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).toEqual([]);
    });

    it('should not fire any requests when start is the same time as the end date', () => {
      const START_DATE = new Date(1999, 0, 0);
      const END_DATE = START_DATE;
      expect(
        getDateRangesToRequest({
          store: {},
          dataStreamId: STREAM_ID,
          start: START_DATE,
          end: END_DATE,
          resolution: 0,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).toEqual([]);
    });

    it('does fire requests when the resulting interval is sub second', () => {
      const START_DATE = new Date(1999, 0, 0);
      const END_DATE = new Date(START_DATE.getTime() + 0.5 * SECOND_IN_MS);
      expect(
        getDateRangesToRequest({
          store: {},
          dataStreamId: STREAM_ID,
          start: START_DATE,
          end: END_DATE,
          resolution: 0,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).toHaveLength(1);
    });

    it('does fire a request when a interval of over 10 seconds', () => {
      const START_DATE = new Date(1999, 0, 0);
      const END_DATE = new Date(START_DATE.getTime() + 10 * SECOND_IN_MS);
      expect(
        getDateRangesToRequest({
          store: {},
          dataStreamId: STREAM_ID,
          start: START_DATE,
          end: END_DATE,
          resolution: 0,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).not.toEqual([]);
    });

    it('should not fire request when date range is identical', () => {
      const START_DATE = new Date(1999, 0, 0);
      const END_DATE = new Date(2002, 0, 0);
      expect(
        getDateRangesToRequest({
          store: {
            [STREAM_ID]: {
              0: {
                id: STREAM_ID,
                resolution: 0,
                requestHistory: [],
                isLoading: false,
                isRefreshing: false,
                dataCache: EMPTY_CACHE,
                requestCache: createDataPointCache({
                  start: START_DATE,
                  end: END_DATE,
                }),
              },
            },
          },
          dataStreamId: STREAM_ID,
          start: START_DATE,
          end: END_DATE,
          resolution: 0,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).toEqual([]);
    });

    it('should fire request for data stream with an error associated with it', () => {
      const START_DATE = new Date(1999, 0, 0);
      const END_DATE = new Date(2002, 0, 0);
      expect(
        getDateRangesToRequest({
          resolution: 0,
          store: {
            [STREAM_ID]: {
              0: {
                id: STREAM_ID,
                resolution: 0,
                requestHistory: [],
                isLoading: false,
                isRefreshing: false,
                error: { msg: 'errored!', type: 'ResourceNotFoundException', status: '404' },
                dataCache: EMPTY_CACHE,
                requestCache: createDataPointCache({
                  start: new Date(1991, 0, 0),
                  end: new Date(1995, 0, 1),
                }),
              },
            },
          },
          dataStreamId: STREAM_ID,
          start: START_DATE,
          end: END_DATE,
          cacheSettings: DEFAULT_CACHE_SETTINGS,
        })
      ).toEqual([[START_DATE, END_DATE]]);
    });
  });
});

describe('getRequestInformations', () => {
  it('returns an empty array if there are no date ranges to request', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchFromStartToEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: EMPTY_CACHE,
              requestCache: createDataPointCache({
                start: START_DATE,
                end: END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([]);
  });

  it('returns an empty array if there are date ranges to request but fetchFromStartToEnd is not set to true', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);
    const CACHE_START_DATE = new Date(1999, 3, 0);
    const CACHE_END_DATE = new Date(1999, 4, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: {},
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: EMPTY_CACHE,
              requestCache: createDataPointCache({
                start: CACHE_START_DATE,
                end: CACHE_END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([]);
  });

  it('returns fetchMostRecentBeforeEnd request information if no date ranges, in settings, and not cached', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchMostRecentBeforeEnd: true, fetchFromStartToEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: EMPTY_CACHE,
              requestCache: createDataPointCache({
                start: START_DATE,
                end: END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      {
        start: START_DATE,
        end: END_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchMostRecentBeforeEnd: true,
      },
    ]);
  });

  it('does not return fetchMostRecentBeforeEnd request information if no date ranges, not cached, and not in settings', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchMostRecentBeforeEnd: false, fetchFromStartToEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: EMPTY_CACHE,
              requestCache: createDataPointCache({
                start: START_DATE,
                end: END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([]);
  });

  it('does not return fetchMostRecentBeforeEnd request information if no date ranges, in settings, and cached', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchMostRecentBeforeEnd: true, fetchFromStartToEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: {
                intervals: [[END_DATE.getTime() - 2000, END_DATE.getTime()]],
                items: [
                  [
                    {
                      x: END_DATE.getTime() - 1000,
                      y: 16,
                    },
                  ],
                ],
              },
              requestCache: createDataPointCache({
                start: START_DATE,
                end: END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([]);
  });

  it('converts date ranges to request informations, setting fetchMostRecentBeforeEnd', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);
    const CACHE_START_DATE = new Date(2000, 3, 0);
    const CACHE_END_DATE = new Date(2000, 4, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchFromStartToEnd: true, fetchMostRecentBeforeEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: EMPTY_CACHE,
              requestCache: createDataPointCache({
                start: CACHE_START_DATE,
                end: CACHE_END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      {
        start: START_DATE,
        end: CACHE_START_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchFromStartToEnd: true,
      },
      {
        start: CACHE_END_DATE,
        end: END_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchFromStartToEnd: true,
      },
      {
        start: START_DATE,
        end: END_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchMostRecentBeforeEnd: true,
      },
    ]);
  });

  it('converts date ranges to request informations, does not set fetchMostRecentBeforeEnd if not in settings', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);
    const CACHE_START_DATE = new Date(2000, 3, 0);
    const CACHE_END_DATE = new Date(2000, 4, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchFromStartToEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: EMPTY_CACHE,
              requestCache: createDataPointCache({
                start: CACHE_START_DATE,
                end: CACHE_END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      {
        start: START_DATE,
        end: CACHE_START_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchFromStartToEnd: true,
      },
      {
        start: CACHE_END_DATE,
        end: END_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchFromStartToEnd: true,
      },
    ]);
  });

  it('converts date ranges to request informations, does not fetchMostRecentBeforeEnd if data point is already cached', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);
    const CACHE_START_DATE = new Date(2000, 3, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchFromStartToEnd: true, fetchMostRecentBeforeEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: {
                intervals: [[END_DATE.getTime() - 2000, END_DATE.getTime()]],
                items: [
                  [
                    {
                      x: END_DATE.getTime() - 1000,
                      y: 16,
                    },
                  ],
                ],
              },
              requestCache: createDataPointCache({
                start: CACHE_START_DATE,
                end: END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      {
        start: START_DATE,
        end: CACHE_START_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchFromStartToEnd: true,
      },
    ]);
  });

  it('appends fetchMostRecentBeforeStart request information', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);
    const CACHE_START_DATE = new Date(2000, 3, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchMostRecentBeforeStart: true, fetchFromStartToEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: EMPTY_CACHE,
              requestCache: createDataPointCache({
                start: CACHE_START_DATE,
                end: END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      {
        start: START_DATE,
        end: END_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchMostRecentBeforeStart: true,
      },
      {
        start: START_DATE,
        end: CACHE_START_DATE,
        id: STREAM_ID,
        fetchFromStartToEnd: true,
        resolution: '0',
      },
    ]);
  });

  it('appends fetchMostRecentBeforeStart request information if no date ranges, in settings, and not cached', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchMostRecentBeforeStart: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: EMPTY_CACHE,
              requestCache: createDataPointCache({
                start: START_DATE,
                end: END_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      {
        start: START_DATE,
        end: END_DATE,
        id: STREAM_ID,
        resolution: '0',
        fetchMostRecentBeforeStart: true,
      },
    ]);
  });

  it('does not fetchMostRecentBeforeStart request information if there is already a recent data point', () => {
    const START_DATE = new Date(2000, 0, 0);
    const END_DATE = new Date(2001, 0, 0);
    const CACHE_START_DATE = new Date(1999, 0, 0);

    expect(
      getRequestInformations({
        request: {
          viewport: { start: START_DATE, end: END_DATE },
          settings: { fetchMostRecentBeforeStart: true, fetchFromStartToEnd: true },
        },
        store: {
          [STREAM_ID]: {
            0: {
              id: STREAM_ID,
              resolution: 0,
              requestHistory: [],
              isLoading: false,
              isRefreshing: false,
              dataCache: {
                intervals: [[START_DATE.getTime() - 2000, START_DATE.getTime()]],
                items: [
                  [
                    {
                      x: START_DATE.getTime() - 1000,
                      y: 16,
                    },
                  ],
                ],
              },
              requestCache: createDataPointCache({
                start: CACHE_START_DATE,
                end: START_DATE,
              }),
            },
          },
        },
        resolution: '0',
        dataStreamId: STREAM_ID,
        start: START_DATE,
        end: END_DATE,
        cacheSettings: DEFAULT_CACHE_SETTINGS,
      })
    ).toEqual([
      {
        start: START_DATE,
        end: END_DATE,
        id: STREAM_ID,
        fetchFromStartToEnd: true,
        resolution: '0',
      },
    ]);
  });
});

describe('retrieve unexpired cached time intervals', () => {
  const DATE_NOW = new Date(2000, 0, 0).getTime();
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => DATE_NOW);
  });

  describe('with one or less caching rules present', () => {
    it('returns all cached intervals when empty cache map provided (nothing is expired)', () => {
      const START = new Date(DATE_NOW - 30 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 5 * MINUTE_IN_MS);
      const requestCache = createDataPointCache({
        start: START,
        end: END,
      });
      const streamStore = {
        id: STREAM_ID,
        resolution: 0,
        requestHistory: [
          {
            start: START,
            end: START,
            requestedAt: END,
          },
        ],
        isLoading: false,
        isRefreshing: false,
        error: undefined,
        dataCache: EMPTY_CACHE,
        requestCache,
      };
      expect(unexpiredCacheIntervals(streamStore, {})).toEqual(requestCache.intervals);
    });

    it('no cached intervals are expired when request range has a duration of 0', () => {
      const START = new Date(DATE_NOW - 5 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 3 * MINUTE_IN_MS);
      const MIDDLE = new Date(DATE_NOW - 4 * MINUTE_IN_MS);
      const REQUESTED_AT = new Date(DATE_NOW - 30 * SECOND_IN_MS);

      const TTL_CACHE_MAP = {
        [10 * MINUTE_IN_MS]: 10 * SECOND_IN_MS,
      };

      const requestCache = createDataPointCache({
        start: START,
        end: END,
        data: [],
      });
      const streamStore = {
        id: STREAM_ID,
        resolution: 0,
        requestHistory: [
          {
            start: MIDDLE,
            end: MIDDLE,
            requestedAt: REQUESTED_AT,
          },
        ],
        isLoading: false,
        isRefreshing: false,
        error: undefined,
        dataCache: EMPTY_CACHE,
        requestCache,
      };
      expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual(requestCache.intervals);
    });

    it('returns empty set of intervals as all caches are expired by a single TTL', () => {
      const START = new Date(DATE_NOW - 5 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 3 * MINUTE_IN_MS);
      const REQUESTED_AT = new Date(DATE_NOW - 30 * SECOND_IN_MS);

      const TTL_CACHE_MAP = {
        [10 * MINUTE_IN_MS]: 10 * SECOND_IN_MS,
      };

      const requestCache = createDataPointCache({
        start: START,
        end: END,
        data: [],
      });
      const streamStore = {
        id: STREAM_ID,
        resolution: 0,
        requestHistory: [
          {
            start: START,
            end: END,
            requestedAt: REQUESTED_AT,
          },
        ],
        isLoading: false,
        isRefreshing: false,
        error: undefined,
        dataCache: EMPTY_CACHE,
        requestCache,
      };
      expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toBeEmpty();
    });

    it('a request fully contained within a cache interval will expire that portion of the cached intervals', () => {
      const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 5 * MINUTE_IN_MS);
      const REQUESTED_AT = new Date(DATE_NOW - 15 * SECOND_IN_MS);

      const HISTORICAL_START = new Date(DATE_NOW - 12 * MINUTE_IN_MS);
      const HISTORICAL_END = new Date(DATE_NOW - 10 * MINUTE_IN_MS);

      const TTL_CACHE_MAP = {
        [30 * MINUTE_IN_MS]: 10 * SECOND_IN_MS,
      };

      const requestCache = createDataPointCache({
        start: START,
        end: END,
        data: [],
      });
      const streamStore = {
        id: STREAM_ID,
        requestHistory: [
          {
            start: HISTORICAL_START,
            end: HISTORICAL_END,
            requestedAt: REQUESTED_AT,
          },
        ],
        isLoading: false,
        isRefreshing: false,
        error: undefined,
        dataCache: EMPTY_CACHE,
        resolution: 0,
        requestCache,
      };

      expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([
        [START.getTime(), HISTORICAL_START.getTime()],
        [HISTORICAL_END.getTime(), END.getTime()],
      ]);
    });

    it('a requested date before the TTL will cause none of the cached region to be expired', () => {
      const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 5 * MINUTE_IN_MS);
      const REQUESTED_AT = new Date(DATE_NOW - 5 * SECOND_IN_MS);

      const HISTORICAL_START = new Date(DATE_NOW - 12 * MINUTE_IN_MS);
      const HISTORICAL_END = new Date(DATE_NOW - 10 * MINUTE_IN_MS);

      const TTL_CACHE_MAP = {
        [30 * MINUTE_IN_MS]: 10 * SECOND_IN_MS,
      };

      const requestCache = createDataPointCache({
        start: START,
        end: END,
        data: [],
      });
      const streamStore = {
        id: STREAM_ID,
        resolution: 0,
        requestHistory: [
          {
            start: HISTORICAL_START,
            end: HISTORICAL_END,
            requestedAt: REQUESTED_AT,
          },
        ],
        isLoading: false,
        isRefreshing: false,
        error: undefined,
        dataCache: EMPTY_CACHE,
        requestCache,
      };

      expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([[START.getTime(), END.getTime()]]);
    });
  });

  describe('with multiple caching rules present', () => {
    describe('with a single historical request', () => {
      it('case #0', () => {
        const TTL_CACHE_MAP = {
          [30 * SECOND_IN_MS]: 0,
          [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
          [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
        };

        const START = new Date(DATE_NOW - 15 * SECOND_IN_MS);
        const END = new Date(DATE_NOW - SECOND_IN_MS);
        const requestCache = createDataPointCache({
          start: START,
          end: END,
          data: [],
        });

        const streamStore = {
          id: STREAM_ID,
          resolution: 0,
          requestHistory: [
            {
              start: START,
              end: END,
              requestedAt: END,
            },
          ],
          isLoading: false,
          isRefreshing: false,
          error: undefined,
          dataCache: EMPTY_CACHE,
          requestCache,
        };
        expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toBeEmpty();
      });

      it('case #1', () => {
        const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
        const END = new Date(DATE_NOW - 2 * MINUTE_IN_MS);

        const TTL_CACHE_MAP = {
          // first rule does apply since it is requested at a time period later than one minute
          [MINUTE_IN_MS]: 10 * SECOND_IN_MS,
          // second rule does not apply since it's requested earlier than 10 minutes
          [HOUR_IN_MS]: 10 * MINUTE_IN_MS,
        };

        const requestCache = createDataPointCache({
          start: START,
          end: END,
          data: [],
        });
        const streamStore = {
          id: STREAM_ID,
          resolution: 0,
          requestHistory: [
            {
              start: START,
              end: END,
              requestedAt: END,
            },
          ],
          isLoading: false,
          isRefreshing: false,
          error: undefined,
          dataCache: EMPTY_CACHE,
          requestCache,
        };

        expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([[START.getTime(), END.getTime()]]);
      });

      it('case #2', () => {
        const TTL_CACHE_MAP = {
          [MINUTE_IN_MS]: 5 * SECOND_IN_MS,
          [5 * MINUTE_IN_MS]: MINUTE_IN_MS,
        };

        const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
        const END = new Date(DATE_NOW - 45 * SECOND_IN_MS);
        const requestCache = createDataPointCache({
          start: START,
          end: END,
          data: [],
        });
        const streamStore = {
          id: STREAM_ID,
          resolution: 0,
          requestHistory: [
            {
              start: START,
              end: END,
              requestedAt: END,
            },
          ],
          isLoading: false,
          isRefreshing: false,
          error: undefined,
          dataCache: EMPTY_CACHE,
          requestCache,
        };

        // only re-request the last minute - the cache rule of (5 minute duration -> 1 minute ttl) since the request was only 45 seconds old
        expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([
          [START.getTime(), DATE_NOW - MINUTE_IN_MS],
        ]);
      });

      it('case #3', () => {
        const TTL_CACHE_MAP = {
          [MINUTE_IN_MS]: 5 * SECOND_IN_MS,
          [5 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
        };

        const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
        const END = new Date(DATE_NOW - 45 * SECOND_IN_MS);
        const requestCache = createDataPointCache({
          start: START,
          end: END,
          data: [],
        });
        const streamStore = {
          id: STREAM_ID,
          resolution: 0,
          requestHistory: [
            {
              start: START,
              end: END,
              requestedAt: END,
            },
          ],
          isLoading: false,
          isRefreshing: false,
          error: undefined,
          dataCache: EMPTY_CACHE,
          requestCache,
        };

        expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([
          [START.getTime(), DATE_NOW - 5 * MINUTE_IN_MS],
        ]);
      });
    });

    describe('with multiple historical requests', () => {
      describe('non-adjacent request history', () => {
        it('case #1', () => {
          const TTL_CACHE_MAP = {
            [30 * SECOND_IN_MS]: 0,
            [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
            [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
          };

          const START_1 = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
          const END_1 = new Date(DATE_NOW - 45 * SECOND_IN_MS);

          const START_2 = new Date(DATE_NOW - 15 * SECOND_IN_MS);
          const END_2 = new Date(DATE_NOW - SECOND_IN_MS);

          // Construct Request Cache
          const initialCache = createDataPointCache({
            start: START_1,
            end: END_1,
            data: [],
          });
          const requestCache = addToDataPointCache({
            start: START_2,
            end: END_2,
            data: [],
            cache: initialCache,
          });

          const streamStore = {
            id: STREAM_ID,
            resolution: 0,
            requestHistory: [
              {
                start: START_1,
                end: END_1,
                requestedAt: END_1,
              },
              {
                start: START_2,
                end: END_2,
                requestedAt: END_2,
              },
            ],
            isLoading: false,
            isRefreshing: false,
            error: undefined,
            dataCache: EMPTY_CACHE,
            requestCache,
          };

          expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([
            [DATE_NOW - 15 * MINUTE_IN_MS, DATE_NOW - MINUTE_IN_MS],
          ]);
        });

        it('case #1', () => {
          const TTL_CACHE_MAP = {
            [30 * SECOND_IN_MS]: 0,
            [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
            [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
          };

          const START_1 = new Date(DATE_NOW - 25 * MINUTE_IN_MS);
          const END_1 = new Date(DATE_NOW - 6 * MINUTE_IN_MS);

          const START_2 = new Date(DATE_NOW - 15 * SECOND_IN_MS);
          const END_2 = new Date(DATE_NOW - SECOND_IN_MS);

          // Construct Request Cache
          const initialCache = createDataPointCache({
            start: START_1,
            end: END_1,
            data: [],
          });
          const requestCache = addToDataPointCache({
            start: START_2,
            end: END_2,
            data: [],
            cache: initialCache,
          });

          const streamStore = {
            id: STREAM_ID,
            resolution: 0,
            requestHistory: [
              {
                start: START_1,
                end: END_1,
                requestedAt: END_1,
              },
              {
                start: START_2,
                end: END_2,
                requestedAt: END_2,
              },
            ],
            isLoading: false,
            isRefreshing: false,
            error: undefined,
            dataCache: EMPTY_CACHE,
            requestCache,
          };

          expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([
            [DATE_NOW - 25 * MINUTE_IN_MS, DATE_NOW - 15 * MINUTE_IN_MS],
          ]);
        });
      });

      describe('adjacent request history', () => {
        it('case #1', () => {
          const TTL_CACHE_MAP = {
            [30 * SECOND_IN_MS]: 0,
            [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
            [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
          };

          const START_1 = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
          const END_1 = new Date(DATE_NOW - 3 * MINUTE_IN_MS);

          const START_2 = END_1;
          const END_2 = new Date(DATE_NOW - SECOND_IN_MS);

          // Construct Request Cache
          const initialCache = createDataPointCache({
            start: START_1,
            end: END_1,
            data: [],
          });
          const requestCache = addToDataPointCache({
            start: START_2,
            end: END_2,
            data: [],
            cache: initialCache,
          });

          const streamStore = {
            id: STREAM_ID,
            resolution: 0,
            requestHistory: [
              {
                start: START_1,
                end: END_1,
                requestedAt: END_1,
              },
              {
                start: START_2,
                end: END_2,
                requestedAt: END_2,
              },
            ],
            isLoading: false,
            isRefreshing: false,
            error: undefined,
            dataCache: EMPTY_CACHE,
            requestCache,
          };

          expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([
            [START_1.getTime(), DATE_NOW - 30 * SECOND_IN_MS],
          ]);
        });

        it('case #2', () => {
          const TTL_CACHE_MAP = {
            [30 * SECOND_IN_MS]: 0,
            [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
            [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
          };

          const START_1 = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
          const END_1 = new Date(DATE_NOW - 45 * SECOND_IN_MS);

          const START_2 = END_1;
          const END_2 = new Date(DATE_NOW - SECOND_IN_MS);

          // Construct Request Cache
          const initialCache = createDataPointCache({
            start: START_1,
            end: END_1,
            data: [],
          });
          const requestCache = addToDataPointCache({
            start: START_2,
            end: END_2,
            data: [],
            cache: initialCache,
          });

          const streamStore = {
            id: STREAM_ID,
            resolution: 0,
            requestHistory: [
              {
                start: START_1,
                end: END_1,
                requestedAt: END_1,
              },
              {
                start: START_2,
                end: END_2,
                requestedAt: END_2,
              },
            ],
            isLoading: false,
            isRefreshing: false,
            error: undefined,
            dataCache: EMPTY_CACHE,
            requestCache,
          };

          expect(unexpiredCacheIntervals(streamStore, TTL_CACHE_MAP)).toEqual([
            [START_1.getTime(), DATE_NOW - MINUTE_IN_MS],
            [DATE_NOW - 45 * SECOND_IN_MS, DATE_NOW - 30 * SECOND_IN_MS],
          ]);
        });
      });
    });
  });
});

describe('checkCacheForRecentPoint', () => {
  const RESOLUTION = 0;
  const STORE: DataStreamsStore = {
    [STREAM_ID]: {
      [RESOLUTION]: {
        id: STREAM_ID,
        resolution: RESOLUTION,
        isLoading: false,
        isRefreshing: false,
        requestHistory: [],
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
      },
    },
  };

  it('make request when data cache is empty', () => {
    const presentInCache = checkCacheForRecentPoint({
      store: STORE,
      dataStreamId: STREAM_ID,
      resolution: RESOLUTION,
      start: new Date(1621879612500),
      cacheSettings: DEFAULT_CACHE_SETTINGS,
    });
    expect(presentInCache).toBeFalse();
  });

  it('does not make request when there is data in cache without a gap', () => {
    const dataCache: IntervalStructure<DataPoint> = {
      intervals: [
        [1621879662000, 1621879912500],
        [1621879912500, 1621880687500],
      ],
      items: [
        [
          {
            x: 1621879662000,
            y: 16,
          },
          {
            x: 1621879722000,
            y: 16,
          },
          {
            x: 1621879782000,
            y: 4,
          },
        ],
        [
          {
            x: 1621880262000,
            y: 4,
          },
          {
            x: 1621880322000,
            y: 13,
          },
          {
            x: 1621880442000,
            y: 7,
          },
        ],
      ],
    };

    STORE[STREAM_ID]![RESOLUTION]!.dataCache = dataCache;
    STORE[STREAM_ID]![RESOLUTION]!.requestCache.intervals = dataCache.intervals;

    const presentInCache = checkCacheForRecentPoint({
      store: STORE,
      dataStreamId: STREAM_ID,
      resolution: RESOLUTION,
      start: new Date(1621880261010),
      cacheSettings: DEFAULT_CACHE_SETTINGS,
    });

    expect(presentInCache).toBeTrue();
  });

  it('make request when there is data in cache but a gap between data in cache and start', () => {
    const dataCache: IntervalStructure<DataPoint> = {
      intervals: [
        [1621879612500, 1621879912500],
        [1621880261000, 1621880687500],
      ],
      items: [
        [
          {
            x: 1621879662000,
            y: 16,
          },
          {
            x: 1621879722000,
            y: 16,
          },
          {
            x: 1621879782000,
            y: 4,
          },
        ],
        [
          {
            x: 1621880262000,
            y: 4,
          },
          {
            x: 1621880322000,
            y: 13,
          },
          {
            x: 1621880442000,
            y: 7,
          },
        ],
      ],
    };

    STORE[STREAM_ID]![RESOLUTION]!.dataCache = dataCache;
    STORE[STREAM_ID]![RESOLUTION]!.requestCache.intervals = dataCache.intervals;

    const presentInCache = checkCacheForRecentPoint({
      store: STORE,
      dataStreamId: STREAM_ID,
      resolution: RESOLUTION,
      start: new Date(1621880261010),
      cacheSettings: DEFAULT_CACHE_SETTINGS,
    });

    expect(presentInCache).toBeFalse();
  });

  it('make request when there is a unexpired request cache but no data cache', () => {
    const requestCache: IntervalStructure<DataPoint> = {
      intervals: [[1621879661000, 1621879912500]],
      items: [],
    };
    STORE[STREAM_ID]![RESOLUTION]!.dataCache = EMPTY_CACHE;
    STORE[STREAM_ID]![RESOLUTION]!.requestCache = requestCache;

    const presentInCache = checkCacheForRecentPoint({
      store: STORE,
      dataStreamId: STREAM_ID,
      resolution: RESOLUTION,
      start: new Date(1621879662000),
      cacheSettings: DEFAULT_CACHE_SETTINGS,
    });

    expect(presentInCache).toBeFalse();
  });

  it('does not make request when there data point in cache aligns exactly with the start of viewport', () => {
    const dataCache: IntervalStructure<DataPoint> = {
      intervals: [[1621879661000, 1621879912500]],
      items: [
        [
          {
            x: 1621879661000,
            y: 16,
          },
          {
            x: 1621879722000,
            y: 16,
          },
          {
            x: 1621879782000,
            y: 4,
          },
        ],
      ],
    };
    STORE[STREAM_ID]![RESOLUTION]!.dataCache = dataCache;
    STORE[STREAM_ID]![RESOLUTION]!.requestCache = EMPTY_CACHE;

    const presentInCache = checkCacheForRecentPoint({
      store: STORE,
      dataStreamId: STREAM_ID,
      resolution: RESOLUTION,
      start: new Date(1621879661000),
      cacheSettings: DEFAULT_CACHE_SETTINGS,
    });

    expect(presentInCache).toBeTrue();
  });

  it('does not make request with overlapping data cache and has data point before start', () => {
    const dataCache: IntervalStructure<DataPoint> = {
      intervals: [[14, 18]],
      items: [
        [
          {
            x: 14,
            y: 16,
          },
          {
            x: 15,
            y: 16,
          },
          {
            x: 17,
            y: 4,
          },
          {
            x: 18,
            y: 4,
          },
        ],
      ],
    };
    STORE[STREAM_ID]![RESOLUTION]!.dataCache = dataCache;
    STORE[STREAM_ID]![RESOLUTION]!.requestCache.intervals = [[14, 18]];

    const presentInCache = checkCacheForRecentPoint({
      store: STORE,
      dataStreamId: STREAM_ID,
      resolution: RESOLUTION,
      start: new Date(14),
      cacheSettings: DEFAULT_CACHE_SETTINGS,
    });

    expect(presentInCache).toBeTrue();
  });

  it('make request in case of overlapping data cache but no dataPoint present before start of viewport', () => {
    const dataCache: IntervalStructure<DataPoint> = {
      intervals: [[13, 18]],
      items: [
        [
          {
            x: 14,
            y: 16,
          },
          {
            x: 15,
            y: 16,
          },
          {
            x: 17,
            y: 4,
          },
          {
            x: 18,
            y: 4,
          },
        ],
      ],
    };
    STORE[STREAM_ID]![RESOLUTION]!.dataCache = dataCache;
    STORE[STREAM_ID]![RESOLUTION]!.requestCache.intervals = [[13, 18]];

    const presentInCache = checkCacheForRecentPoint({
      store: STORE,
      dataStreamId: STREAM_ID,
      resolution: RESOLUTION,
      start: new Date(13),
      cacheSettings: DEFAULT_CACHE_SETTINGS,
    });

    expect(presentInCache).toBeFalse();
  });

  it('make request when data cache has only expired data points before start of viewport', () => {
    const dataCache: IntervalStructure<DataPoint> = {
      intervals: [[14, 18]],
      items: [
        [
          {
            x: 14,
            y: 16,
          },
          {
            x: 15,
            y: 16,
          },
          {
            x: 17,
            y: 4,
          },
          {
            x: 18,
            y: 4,
          },
        ],
      ],
    };
    STORE[STREAM_ID]![RESOLUTION]!.dataCache = dataCache;
    STORE[STREAM_ID]![RESOLUTION]!.requestCache.intervals = [[16, 18]];

    const presentInCache = checkCacheForRecentPoint({
      store: STORE,
      dataStreamId: STREAM_ID,
      resolution: RESOLUTION,
      start: new Date(16),
      cacheSettings: DEFAULT_CACHE_SETTINGS,
    });

    expect(presentInCache).toBeFalse();
  });
});

describe('maxCacheDuration', () => {
  it('returns the maximum cache TTL duration', () => {
    expect(
      maxCacheDuration({
        ttlDurationMapping: {
          [1.2 * MINUTE_IN_MS]: 0,
          [3 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
          [20 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
        },
      })
    ).toBe(20 * MINUTE_IN_MS);
  });

  it('handles empty mappings', () => {
    expect(
      maxCacheDuration({
        ttlDurationMapping: {},
      })
    ).toBe(0);
  });
});
