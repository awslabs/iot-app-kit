import { DEFAULT_GROUPING, type TrendCursorsData } from '../../state';
import { type TrendCursorGroupId, type Updater } from '../../types';

export type DisconnectAction = {
  type: 'DISCONNECT';
  payload: {
    groupId: TrendCursorGroupId;
    updater: Updater;
  };
};

export const onDisconnect = (
  group: TrendCursorGroupId,
  updater: Updater
): DisconnectAction => ({
  type: 'DISCONNECT',
  payload: {
    groupId: group,
    updater,
  },
});

export const disconnectUpdaterFromGroup = (
  { groupId, updater }: DisconnectAction['payload'],
  groups: TrendCursorsData['groups']
) => {
  const currentGrouping = groups[groupId] ?? DEFAULT_GROUPING;
  return {
    ...groups,
    [groupId]: {
      ...currentGrouping,
      connectedCharts: currentGrouping.connectedCharts.filter(
        (connectedUpdater) => connectedUpdater !== updater
      ),
    },
  };
};
