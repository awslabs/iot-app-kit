import { sub } from 'date-fns';
import { Interval, Viewport } from '../../types';
import { IntervalTransformer, getViewportType } from './transformer';
import { ANCHOR_DATE } from './testData';

describe('transform intervals', () => {
  it('determines the viewport type of a viewport', () => {
    expect(getViewportType({ duration: '5m' })).toEqual('duration');
    expect(getViewportType({ start: new Date(), end: new Date() })).toEqual(
      'historical'
    );
  });

  it('converts duration viewports into intervals', () => {
    const now = ANCHOR_DATE.getTime();

    const transformer = new IntervalTransformer({
      now,
      viewportType: 'duration',
    });

    expect(transformer.toInterval({ duration: '5m' })).toEqual({
      start: sub(new Date(now), { minutes: 5 }),
      end: new Date(now),
    });

    expect(transformer.toInterval({ duration: '30d' })).toEqual({
      start: sub(new Date(now), { days: 30 }),
      end: new Date(now),
    });
  });

  it('converts historical viewports into intervals', () => {
    const now = ANCHOR_DATE.getTime();

    const transformer = new IntervalTransformer({
      now,
      viewportType: 'historical',
    });

    const historicalViewport = {
      start: sub(new Date(now), { minutes: 5 }),
      end: new Date(now),
    };
    const historicalViewport2 = {
      start: sub(new Date(now), { minutes: 5 }),
      end: new Date(now),
    };

    expect(transformer.toInterval(historicalViewport)).toEqual(
      historicalViewport
    );

    expect(transformer.toInterval(historicalViewport2)).toEqual(
      historicalViewport2
    );
  });

  it('preserves refresh rate as an interval group', () => {
    const now = ANCHOR_DATE.getTime();

    const transformer = new IntervalTransformer({
      now,
      viewportType: 'historical',
    });

    const historicalViewport: Viewport = {
      refreshRate: 5000,
      start: sub(new Date(now), { minutes: 5 }),
      end: new Date(now),
    };
    const historicalViewport2: Viewport = {
      refreshRate: 20000,
      start: sub(new Date(now), { minutes: 5 }),
      end: new Date(now),
    };

    expect(transformer.toInterval(historicalViewport)).toEqual({
      start: historicalViewport.start,
      end: historicalViewport.end,
      group: historicalViewport.refreshRate,
    });

    expect(transformer.toInterval(historicalViewport2)).toEqual({
      start: historicalViewport2.start,
      end: historicalViewport2.end,
      group: historicalViewport2.refreshRate,
    });
  });

  it('converts an interval to a duration viewport', () => {
    const now = ANCHOR_DATE.getTime();

    const transformer = new IntervalTransformer({
      now,
      viewportType: 'duration',
    });

    const interval: Interval = {
      group: 5000,
      start: sub(new Date(now), { minutes: 5 }),
      end: new Date(now),
    };

    expect(transformer.toViewport(interval)).toEqual({
      duration: 300000,
      refreshRate: 5000,
      startOffset: 0,
    });

    const interval2: Interval = {
      group: 5000,
      start: sub(new Date(now - 20000), { minutes: 5 }),
      end: new Date(now - 20000),
    };

    expect(transformer.toViewport(interval2)).toEqual({
      duration: 300000,
      refreshRate: 5000,
      startOffset: 20000,
    });
  });

  it('converts an interval to a historical viewport', () => {
    const now = ANCHOR_DATE.getTime();

    const transformer = new IntervalTransformer({
      now,
      viewportType: 'historical',
    });

    const interval: Interval = {
      group: 5000,
      start: sub(new Date(now), { minutes: 5 }),
      end: new Date(now),
    };

    expect(transformer.toViewport(interval)).toEqual({
      start: interval.start,
      end: interval.end,
      refreshRate: 5000,
    });
  });
});
