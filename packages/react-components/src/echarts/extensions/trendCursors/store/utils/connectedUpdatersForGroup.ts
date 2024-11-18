import { type TrendCursorsData } from '../state';
import {
  type TrendCursor,
  type TrendCursorGroupId,
  type Updater,
  type UpdaterAction,
} from '../types';

export const getConnectedUpdaters = (
  groupId: TrendCursorGroupId,
  groups: TrendCursorsData['groups']
) => groups[groupId]?.connectedCharts ?? [];

export const executeConnectedUpdaters = (
  connectedCharts: Updater[] = [],
  trendCursors: TrendCursor[] = [],
  action?: UpdaterAction
) => {
  if (!action) return;
  connectedCharts.forEach((updater) => updater(trendCursors, action));
};
