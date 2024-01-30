// Echarts core use type does not map correctly to the echarts extension type so exporting as any

import copy from 'copy-to-clipboard';
import { EChartsExtensionInstallRegisters } from 'echarts/types/src/extension';
import {
  AddTrendCursorAction,
  AddTrendCursorActionType,
} from './addTrendCursors';
import { getXAxisDataValue } from '../view/utils';
import useDataStore from '../../../../store';
import { onAddTrendCursor, onDeleteTrendCursor } from '../store';
import {
  RemoveNearestTrendCursorActionType,
  RemoveTrendCursorAction,
} from './removeNearestTrendCursor';
import { closestTrendCursor } from './closestTrendCursor';
import { getTrendCursors } from './getTrendCursors';
import {
  CopyTrendCursorAction,
  CopyTrendCursorActionType,
} from './copyNearestTrendCursor';
import { formatTrendCursorForCopy } from './formatTrendCursorForCopy';

// eslint-disable-next-line
export const actionExtension: any = (
  registers: EChartsExtensionInstallRegisters
) => {
  registers.registerAction(
    AddTrendCursorActionType,
    ({ event, trendCursor, chartId }: AddTrendCursorAction, ecmodel, api) => {
      if (
        !event ||
        !trendCursor ||
        ecmodel.getOption().appKitChartId !== chartId ||
        getTrendCursors(ecmodel).length > 4
      )
        return;

      const date = getXAxisDataValue(event.offsetX, api);

      useDataStore
        .getState()
        .trendCursorsDispatch(onAddTrendCursor({ ...trendCursor, date }));
    }
  );

  registers.registerAction(
    RemoveNearestTrendCursorActionType,
    ({ event, chartId }: RemoveTrendCursorAction, ecmodel, api) => {
      if (!event || ecmodel.getOption().appKitChartId !== chartId) return;

      const date = getXAxisDataValue(event.offsetX, api);

      const cursorToDelete = closestTrendCursor(date, getTrendCursors(ecmodel));
      if (!cursorToDelete) return;

      const { id, group } = cursorToDelete;

      if (!group) return;

      useDataStore
        .getState()
        .trendCursorsDispatch(onDeleteTrendCursor({ id, group }));
    }
  );

  registers.registerAction(
    CopyTrendCursorActionType,
    ({ event, chartId }: CopyTrendCursorAction, ecmodel, api) => {
      if (!event || !chartId || ecmodel.getOption().appKitChartId !== chartId)
        return;

      const date = getXAxisDataValue(event.offsetX, api);

      const cursorToCopy = closestTrendCursor(date, getTrendCursors(ecmodel));
      if (!cursorToCopy) return;

      // Trend cursor values are prefixed with the chart id
      // since they can be values across charts but related
      // to the same trend cursor
      const trendCursorValues = Object.values(
        useDataStore.getState().trendCursorValues[cursorToCopy.id] ?? {}
      ).filter((trendCursorValue) => trendCursorValue.id.startsWith(chartId));

      // using copy-to-clipboard library to copy in a Excel sheet paste-able format
      copy(formatTrendCursorForCopy(cursorToCopy, trendCursorValues), {
        format: 'text/plain',
      });
    }
  );
};
