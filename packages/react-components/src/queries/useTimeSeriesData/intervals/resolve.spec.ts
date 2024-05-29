import { sub, add, Duration } from 'date-fns';
import { LIVE_DATA_INTERVALS } from './liveData';
import { resolve } from './resolve';
import { IntervalTransformer } from './utils';
import { ANCHOR_DATE } from './utils/testData';
import { Viewport } from '../types';
import { isDurationViewport, parseDuration } from '@iot-app-kit/core';

const slideViewport = (viewport: Viewport, duration: Duration): Viewport => {
  if (isDurationViewport(viewport)) {
    console.warn('Util is only meant for historical viewports.');
    return viewport;
  }

  return {
    ...viewport,
    start: add(viewport.start, duration),
    end: add(viewport.end, duration),
  };
};

describe('resolve viewports', () => {
  it('handles duration viewports with live data intervals', () => {
    const intervalTransformer = new IntervalTransformer({
      now: ANCHOR_DATE.getTime(),
      viewportType: 'duration',
    });

    expect(
      resolve({
        viewport: { duration: '1m' },
        existingViewports: [],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([LIVE_DATA_INTERVALS[0]]);

    expect(
      resolve({
        viewport: { duration: '5m' },
        existingViewports: [],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([
      LIVE_DATA_INTERVALS[2],
      LIVE_DATA_INTERVALS[1],
      LIVE_DATA_INTERVALS[0],
    ]);

    expect(
      resolve({
        viewport: { duration: '10m' },
        existingViewports: [],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([
      LIVE_DATA_INTERVALS[2],
      LIVE_DATA_INTERVALS[1],
      LIVE_DATA_INTERVALS[0],
    ]);
  });

  it('handles historical viewports with live data intervals', () => {
    const intervalTransformer = new IntervalTransformer({
      now: ANCHOR_DATE.getTime(),
      viewportType: 'historical',
    });

    const liveDataIntervalsAsHistorical = LIVE_DATA_INTERVALS.map((interval) =>
      intervalTransformer.toViewport(intervalTransformer.toInterval(interval))
    );

    expect(
      resolve({
        viewport: { start: sub(ANCHOR_DATE, { minutes: 1 }), end: ANCHOR_DATE },
        existingViewports: [],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([liveDataIntervalsAsHistorical[0]]);

    expect(
      resolve({
        viewport: { start: sub(ANCHOR_DATE, { minutes: 5 }), end: ANCHOR_DATE },
        existingViewports: [],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([
      liveDataIntervalsAsHistorical[2],
      liveDataIntervalsAsHistorical[1],
      liveDataIntervalsAsHistorical[0],
    ]);

    expect(
      resolve({
        viewport: {
          start: sub(ANCHOR_DATE, { minutes: 10 }),
          end: ANCHOR_DATE,
        },
        existingViewports: [],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([
      liveDataIntervalsAsHistorical[2],
      liveDataIntervalsAsHistorical[1],
      liveDataIntervalsAsHistorical[0],
    ]);
  });

  it('returns the viewport if there are no existing ones to use', () => {
    const intervalTransformer = new IntervalTransformer({
      now: ANCHOR_DATE.getTime(),
      viewportType: 'historical',
    });

    const viewport = {
      start: sub(ANCHOR_DATE, { minutes: 5 }),
      end: ANCHOR_DATE,
    };

    expect(
      resolve({
        viewport,
        existingViewports: [],
        liveDataViewports: [],
        intervalTransformer,
      })
    ).toEqual([viewport]);
  });

  it('utilizes existing viewports', () => {
    const intervalTransformer = new IntervalTransformer({
      now: ANCHOR_DATE.getTime(),
      viewportType: 'historical',
    });

    const viewport = {
      start: sub(ANCHOR_DATE, { minutes: 5 }),
      end: ANCHOR_DATE,
    };

    const existingViewports = [
      slideViewport(viewport, { minutes: -10 }),
      slideViewport(viewport, { minutes: -5 }),
      viewport,
    ] as const;

    const expected = {
      start: sub(ANCHOR_DATE, { minutes: 15 }),
      end: ANCHOR_DATE,
    };

    expect(
      resolve({
        viewport: {
          start: sub(ANCHOR_DATE, { minutes: 13 }),
          end: sub(ANCHOR_DATE, { minutes: 1 }),
        },
        existingViewports: [...existingViewports],
        liveDataViewports: [],
        intervalTransformer,
      })
    ).toEqual([expected]);
  });

  it('fills in gaps in for duration viewports', () => {
    const intervalTransformer = new IntervalTransformer({
      now: ANCHOR_DATE.getTime(),
      viewportType: 'duration',
    });

    expect(
      resolve({
        viewport: { duration: '30d' },
        existingViewports: [],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([
      {
        duration: parseDuration('30d') - parseDuration('20m'),
        startOffset: parseDuration('20m'),
      },
      LIVE_DATA_INTERVALS[2],
      LIVE_DATA_INTERVALS[1],
      LIVE_DATA_INTERVALS[0],
    ]);

    expect(
      resolve({
        viewport: { duration: '30d' },
        existingViewports: [
          {
            start: sub(ANCHOR_DATE, { minutes: 22 }),
            end: sub(ANCHOR_DATE, { minutes: 20 }),
          },
          {
            start: sub(ANCHOR_DATE, { minutes: 30 }),
            end: sub(ANCHOR_DATE, { minutes: 22 }),
          },
        ],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([
      {
        duration: parseDuration('30d') - parseDuration('30m'),
        startOffset: parseDuration('30m'),
      },
      { duration: parseDuration('10m'), startOffset: parseDuration('20m') },
      LIVE_DATA_INTERVALS[2],
      LIVE_DATA_INTERVALS[1],
      LIVE_DATA_INTERVALS[0],
    ]);
  });

  it('fills in gaps in for historical viewports', () => {
    const intervalTransformer = new IntervalTransformer({
      now: ANCHOR_DATE.getTime(),
      viewportType: 'historical',
    });

    const liveDataIntervalsAsHistorical = LIVE_DATA_INTERVALS.map((interval) =>
      intervalTransformer.toViewport(intervalTransformer.toInterval(interval))
    );

    expect(
      resolve({
        viewport: { start: sub(ANCHOR_DATE, { days: 30 }), end: ANCHOR_DATE },
        existingViewports: [],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([
      {
        start: sub(ANCHOR_DATE, { days: 30 }),
        end: sub(ANCHOR_DATE, { minutes: 20 }),
      },
      liveDataIntervalsAsHistorical[2],
      liveDataIntervalsAsHistorical[1],
      liveDataIntervalsAsHistorical[0],
    ]);

    expect(
      resolve({
        viewport: { start: sub(ANCHOR_DATE, { days: 30 }), end: ANCHOR_DATE },
        existingViewports: [
          {
            start: sub(ANCHOR_DATE, { minutes: 22 }),
            end: sub(ANCHOR_DATE, { minutes: 20 }),
          },
          {
            start: sub(ANCHOR_DATE, { minutes: 30 }),
            end: sub(ANCHOR_DATE, { minutes: 22 }),
          },
        ],
        liveDataViewports: LIVE_DATA_INTERVALS,
        intervalTransformer,
      })
    ).toEqual([
      {
        start: sub(ANCHOR_DATE, { days: 30 }),
        end: sub(ANCHOR_DATE, { minutes: 30 }),
      },
      {
        start: sub(ANCHOR_DATE, { minutes: 30 }),
        end: sub(ANCHOR_DATE, { minutes: 20 }),
      },
      liveDataIntervalsAsHistorical[2],
      liveDataIntervalsAsHistorical[1],
      liveDataIntervalsAsHistorical[0],
    ]);
  });
});
