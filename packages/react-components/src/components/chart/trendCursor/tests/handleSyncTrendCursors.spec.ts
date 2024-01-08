import { describe, expect } from '@jest/globals';
import { calculateSyncDelta } from '../sync/calculateSyncDelta';

import { InternalGraphicComponentGroupOption } from '../types';

describe('calculateSyncDelta', () => {
  it('return all empty arrays', () => {
    const delta = calculateSyncDelta({ syncedTrendCursors: {}, graphic: [] });
    expect(delta).toStrictEqual({
      toBeAdded: [],
      toBeUpdated: [],
      toBeDeleted: [],
    });
  });
  it('return toBeCreated when there is a new sync TC', () => {
    const timestamp =
      Date.parse('2023-07-13T16:00:00.000Z') + 1000 * 60 * 60 * 2; // 1689271200000
    const delta = calculateSyncDelta({
      syncedTrendCursors: { 'trendCursor-1': { timestamp } },
      graphic: [],
    });
    expect(delta).toStrictEqual({
      toBeAdded: ['trendCursor-1'],
      toBeUpdated: [],
      toBeDeleted: [],
    });
  });

  it('return toBeUpdated the timestamps do not match', () => {
    const timestamp =
      Date.parse('2023-07-13T16:00:00.000Z') + 1000 * 60 * 60 * 2; // 1689271200000
    const delta = calculateSyncDelta({
      syncedTrendCursors: { 'trendCursor-1': { timestamp } },
      graphic: [
        {
          id: 'trendCursor-1',
          timestampInMs: timestamp - 1000 * 60 * 60,
          x: 100,
        } as InternalGraphicComponentGroupOption,
      ],
    });
    expect(delta).toStrictEqual({
      toBeAdded: [],
      toBeUpdated: [
        {
          id: 'trendCursor-1',
          index: 0,
          newTimestamp: 1689271200000,
          timestampInMs: 1689267600000,
        },
      ],
      toBeDeleted: [],
    });
  });

  it('return toBeDeleted when sync TC does not have the existing graphic', () => {
    const timestamp =
      Date.parse('2023-07-13T16:00:00.000Z') + 1000 * 60 * 60 * 2; // 1689271200000
    const delta = calculateSyncDelta({
      syncedTrendCursors: {},
      graphic: [
        {
          id: 'trendCursor-1',
          timestampInMs: timestamp - 1000 * 60 * 60,
          x: 100,
        } as InternalGraphicComponentGroupOption,
      ],
    });
    expect(delta).toStrictEqual({
      toBeAdded: [],
      toBeUpdated: [],
      toBeDeleted: [
        {
          id: 'trendCursor-1',
          index: 0,
        },
      ],
    });
  });
});
