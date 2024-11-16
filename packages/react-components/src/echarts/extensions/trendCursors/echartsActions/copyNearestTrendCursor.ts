import { type ElementEvent, type Payload } from 'echarts';

export const CopyTrendCursorActionType = 'COPY_TREND_CURSOR' as const;

export interface CopyTrendCursorAction extends Payload {
  event?: ElementEvent;
  chartId?: string;
}

export const copyNearestTrendCursor = (
  event: ElementEvent,
  chartId?: string
): CopyTrendCursorAction => ({
  type: CopyTrendCursorActionType,
  event,
  chartId,
});
