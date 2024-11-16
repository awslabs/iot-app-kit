import { DEFAULT_GROUPING, type TrendCursorsData } from '../../state';
import { type Updater, type TrendCursorGroupId } from '../../types';

export type ConnectAction = {
  type: 'CONNECT';
  payload: {
    groupId: TrendCursorGroupId;
    updater: Updater;
  };
};

export const onConnect = (
  group: TrendCursorGroupId,
  updater: Updater
): ConnectAction => ({
  type: 'CONNECT',
  payload: {
    groupId: group,
    updater,
  },
});

export const connectUpdaterToGroup = (
  { groupId, updater }: ConnectAction['payload'],
  groups: TrendCursorsData['groups']
) => {
  const currentGrouping = groups[groupId] ?? DEFAULT_GROUPING;
  return {
    ...groups,
    [groupId]: {
      ...currentGrouping,
      connectedCharts: [...currentGrouping.connectedCharts, updater],
    },
  };
};
