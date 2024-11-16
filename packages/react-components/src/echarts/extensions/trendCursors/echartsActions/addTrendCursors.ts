import { type ElementEvent, type Payload } from 'echarts';
import { type TrendCursor } from '../store';

export const AddTrendCursorActionType = 'ADD_TREND_CURSOR' as const;

export interface AddTrendCursorAction extends Payload {
  event?: ElementEvent;
  trendCursor?: Pick<TrendCursor, 'id' | 'color' | 'group'>;
  chartId?: string;
}
export const addTrendCursor = (
  event: ElementEvent,
  trendCursor: Pick<TrendCursor, 'id' | 'color' | 'group'>,
  chartId?: string
): AddTrendCursorAction => ({
  type: AddTrendCursorActionType,
  event,
  trendCursor,
  chartId,
});
