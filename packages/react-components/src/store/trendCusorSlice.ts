import { type StateCreator } from 'zustand';

export interface TrendCursorGroup {
  [tcId: string]: {
    timestamp: number;
  };
}
export interface TrendCursorGroups {
  [groupId: string]: TrendCursorGroup;
}
export interface TrendCursorsData {
  trendCursorGroups: TrendCursorGroups;
}

export interface TrendCursorsState extends TrendCursorsData {
  addTrendCursorsGroup: (groupId: string) => void;
  deleteTrendCursorsGroup: (groupId: string) => void;
  addTrendCursors: ({
    groupId,
    tcId,
    timestamp,
  }: {
    groupId: string;
    tcId: string;
    timestamp: number;
  }) => void;
  updateTrendCursors: ({
    groupId,
    tcId,
    timestamp,
  }: {
    groupId: string;
    tcId: string;
    timestamp: number;
  }) => void;
  deleteTrendCursors: ({
    groupId,
    tcId,
  }: {
    groupId: string;
    tcId: string;
  }) => void;
}

export const createTrendCursorsSlice: StateCreator<TrendCursorsState> = (
  set
) => ({
  trendCursorGroups: {},
  addTrendCursorsGroup: (groupId) =>
    set((state) => ({
      trendCursorGroups: { ...state.trendCursorGroups, [groupId]: {} },
    })),
  deleteTrendCursorsGroup: (groupId) =>
    set((state) => {
      const allGroups = { ...state.trendCursorGroups };
      delete allGroups[groupId];
      return Object.assign({}, state, { trendCursorGroups: allGroups });
    }),
  addTrendCursors: ({ groupId, tcId, timestamp }) =>
    set((state) =>
      Object.assign({}, state, {
        trendCursorGroups: {
          ...state.trendCursorGroups,
          [groupId]: {
            ...state.trendCursorGroups[groupId],
            [tcId]: { timestamp },
          },
        },
      })
    ),
  updateTrendCursors: ({ groupId, tcId, timestamp }) =>
    set((state) =>
      Object.assign({}, state, {
        trendCursorGroups: {
          ...state.trendCursorGroups,
          [groupId]: {
            ...state.trendCursorGroups[groupId],
            [tcId]: { timestamp },
          },
        },
      })
    ),
  deleteTrendCursors: ({ groupId, tcId }: { groupId: string; tcId: string }) =>
    set((state: TrendCursorsData) => {
      const tempGroup = { ...state.trendCursorGroups[groupId] };
      delete tempGroup[tcId];
      return Object.assign({}, state, {
        trendCursorGroups: { ...state.trendCursorGroups, [groupId]: tempGroup },
      });
    }),
});
