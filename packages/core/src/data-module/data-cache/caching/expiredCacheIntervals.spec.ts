import { getExpiredCacheIntervals } from './expiredCacheIntervals';
import { MINUTE_IN_MS, SECOND_IN_MS } from '../../../common/time';
import type { TTLDurationMapping } from '../types';

const DATE_NOW = new Date(2000, 0, 0).getTime();
describe('expired cache intervals', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockImplementation(() => DATE_NOW);
  });

  describe('one or less cache rules present', () => {
    it('with no cache rules, returns empty collection of expired cache intervals', () => {
      const TTL_CACHE_MAPPING = {};

      const START = new Date(1999, 0, 0);
      const END = new Date(2000, 0, 0);
      const REQUESTED_AT = END;

      expect(
        getExpiredCacheIntervals(TTL_CACHE_MAPPING, {
          start: START,
          end: END,
          requestedAt: REQUESTED_AT,
        })
      ).toBeEmpty();
    });

    it('truncates on the duration boundary of the cache rule', () => {
      const TTL_CACHE_MAP = {
        [5 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      };

      const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 45 * SECOND_IN_MS);
      const REQUESTED_AT = END;

      expect(
        getExpiredCacheIntervals(TTL_CACHE_MAP, {
          start: START,
          end: END,
          requestedAt: REQUESTED_AT,
        })
      ).toEqual([[DATE_NOW - 5 * MINUTE_IN_MS, END.getTime()]]);
    });

    it('ignores cache rule that has a duration less than the the duration between the requested at date and the present date', () => {
      const TTL_CACHE_MAP = {
        // The last thirty seconds of any request is always re-requested
        [30 * SECOND_IN_MS]: 0,
      };

      const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 45 * SECOND_IN_MS);
      const REQUESTED_AT = END;

      expect(
        getExpiredCacheIntervals(TTL_CACHE_MAP, {
          start: START,
          end: END,
          requestedAt: REQUESTED_AT,
        })
      ).toBeEmpty();
    });
  });

  describe('one or more cache rules', () => {
    it('case #1', () => {
      const TTL_CACHE_MAP = {
        [MINUTE_IN_MS]: 5 * SECOND_IN_MS,
        [5 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      };

      const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 45 * SECOND_IN_MS);
      const REQUESTED_AT = END;

      expect(
        getExpiredCacheIntervals(TTL_CACHE_MAP, {
          start: START,
          end: END,
          requestedAt: REQUESTED_AT,
        })
      ).toEqual([[DATE_NOW - 5 * MINUTE_IN_MS, END.getTime()]]);
    });

    it('case #2', () => {
      const TTL_CACHE_MAP = {
        [MINUTE_IN_MS]: 5 * SECOND_IN_MS,
        [5 * MINUTE_IN_MS]: 2 * MINUTE_IN_MS,
      };

      const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 45 * SECOND_IN_MS);
      const REQUESTED_AT = END;

      expect(
        getExpiredCacheIntervals(TTL_CACHE_MAP, {
          start: START,
          end: END,
          requestedAt: REQUESTED_AT,
        })
      ).toEqual([[DATE_NOW - MINUTE_IN_MS, END.getTime()]]);
    });

    it('case #3', () => {
      const TTL_CACHE_MAP: TTLDurationMapping = {
        [30 * SECOND_IN_MS]: 0,
        [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
        [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
      };

      const START = new Date(DATE_NOW - 15 * MINUTE_IN_MS);
      const END = new Date(DATE_NOW - 45 * SECOND_IN_MS);
      const REQUESTED_AT = new Date(DATE_NOW - 15 * SECOND_IN_MS);

      expect(
        getExpiredCacheIntervals(TTL_CACHE_MAP, {
          start: START,
          end: END,
          requestedAt: REQUESTED_AT,
        })
      ).toBeEmpty();
    });
  });

  it('case #4', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 4 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 45 * SECOND_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW - 45 * SECOND_IN_MS);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toEqual([[DATE_NOW - MINUTE_IN_MS, END.getTime()]]);
  });

  it('case #5', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 10 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 5 * MINUTE_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW - 5 * SECOND_IN_MS);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toBeEmpty();
  });

  it('case #6', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 10 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 5 * MINUTE_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW - 35 * SECOND_IN_MS);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toBeEmpty();
  });

  it('case #7', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 10 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 5 * MINUTE_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW - 4 * MINUTE_IN_MS);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toBeEmpty();
  });

  it('case #8', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 10 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 7 * MINUTE_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW - 4 * MINUTE_IN_MS);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toBeEmpty();
  });

  it('case #9', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 10 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 7 * MINUTE_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW - 6 * MINUTE_IN_MS);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toEqual([[START.getTime(), END.getTime()]]);
  });

  it('case #10', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 25 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 7 * MINUTE_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW - 6 * MINUTE_IN_MS);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toEqual([[DATE_NOW - 15 * MINUTE_IN_MS, END.getTime()]]);
  });

  it('case #11', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 25 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 7 * MINUTE_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toBeEmpty();
  });

  it('case #12', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 25 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 0.1 * SECOND_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW - 0.1 * SECOND_IN_MS);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toEqual([[DATE_NOW - 30 * SECOND_IN_MS, DATE_NOW - 0.1 * SECOND_IN_MS]]);
  });

  it('case #13', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 25 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW - 0.1 * SECOND_IN_MS);
    const REQUESTED_AT = new Date(DATE_NOW);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toBeEmpty();
  });

  it('case #14', () => {
    const TTL_CACHE_MAP: TTLDurationMapping = {
      [30 * SECOND_IN_MS]: 0,
      [MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      [15 * MINUTE_IN_MS]: 5 * MINUTE_IN_MS,
    };

    const START = new Date(DATE_NOW - 25 * MINUTE_IN_MS);
    const END = new Date(DATE_NOW);
    const REQUESTED_AT = new Date(DATE_NOW);

    expect(
      getExpiredCacheIntervals(TTL_CACHE_MAP, {
        start: START,
        end: END,
        requestedAt: REQUESTED_AT,
      })
    ).toBeEmpty();
  });
});
