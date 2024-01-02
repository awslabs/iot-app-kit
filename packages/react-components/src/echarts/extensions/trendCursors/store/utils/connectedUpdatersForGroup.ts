import { TrendCursorsData } from '../state';
import {
  TrendCursor,
  TrendCursorGroupId,
  Updater,
  UpdaterAction,
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
