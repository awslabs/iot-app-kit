import { SyncChanges } from '../types';

// This handles the sync between the Zustand sync state and local state
// a user action can be one of the following
// add , delete or drag. given only one can happen at a given time returning as soon as we find that an action has occurred
export const calculateSyncDelta = ({
  syncedTrendCursors = {},
  graphic,
}: SyncChanges) => {
  const existingIds: string[] = graphic.map((g) => g.id as string);
  const toBeAdded = Object.keys(syncedTrendCursors).filter(
    (syncedTrendCursorId) =>
      existingIds.findIndex((id) => id === syncedTrendCursorId) === -1
  );

  if (toBeAdded.length)
    return {
      toBeAdded,
      toBeUpdated: [],
      toBeDeleted: [],
    };

  const toBeUpdated = graphic
    .map((g, index) => ({
      index,
      id: g.id,
      timestampInMs: g.timestampInMs,
      newTimestamp: syncedTrendCursors[g.id as string]?.timestamp,
    }))
    .filter((g) => {
      const syncedTrendCursorTimeStamp =
        syncedTrendCursors[g.id as string]?.timestamp;
      return !!(
        syncedTrendCursorTimeStamp &&
        syncedTrendCursorTimeStamp !== g.timestampInMs
      );
    });

  if (toBeUpdated.length)
    return {
      toBeAdded: [],
      toBeUpdated,
      toBeDeleted: [],
    };

  const toBeDeleted = graphic
    .map((g, index) => ({ index, id: g.id }))
    .filter((g) => !syncedTrendCursors[g.id as string]);

  return {
    toBeAdded: [],
    toBeUpdated: [],
    toBeDeleted,
  };
};
