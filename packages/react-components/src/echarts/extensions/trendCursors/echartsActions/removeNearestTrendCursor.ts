import { type ElementEvent, type Payload } from 'echarts';

export const RemoveNearestTrendCursorActionType =
  'REMOVE_NEAREST_TREND_CURSOR' as const;

export interface RemoveTrendCursorAction extends Payload {
  event?: ElementEvent;
  chartId?: string;
}
export const removeNearestTrendCursor = (
  event: ElementEvent,
  chartId?: string
): RemoveTrendCursorAction => ({
  type: RemoveNearestTrendCursorActionType,
  event,
  chartId,
});
