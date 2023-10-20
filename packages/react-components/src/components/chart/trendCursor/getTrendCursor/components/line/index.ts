// this function return the TC line and the ondrag handles the user dragging action
import { SizeConfig } from '../../../../types';
import { DEFAULT_MARGIN } from '../../../../eChartsConstants';
import {
  TREND_CURSOR_DRAG_RECT_WIDTH,
  TREND_CURSOR_LINE_COLOR,
  TREND_CURSOR_LINE_WIDTH,
  TREND_CURSOR_Z_INDEX,
} from '../../../constants';

export const addTCLine = (uId: string, size: SizeConfig) => ({
  type: 'group',
  id: `line-${uId}`,
  draggable: 'horizontal' as const,
  children: [
    {
      z: TREND_CURSOR_Z_INDEX + 1,
      type: 'line',
      id: `group-line-${uId}`,
      shape: {
        y1: DEFAULT_MARGIN - 6,
        y2: size.height - DEFAULT_MARGIN,
      },
      style: {
        stroke: TREND_CURSOR_LINE_COLOR,
        lineWidth: TREND_CURSOR_LINE_WIDTH,
      },
    },
    {
      type: 'rect',
      id: `group-rect-${uId}`,
      z: TREND_CURSOR_Z_INDEX + 1,
      shape: {
        x: -TREND_CURSOR_DRAG_RECT_WIDTH / 2,
        y: DEFAULT_MARGIN - 6,
        width: TREND_CURSOR_DRAG_RECT_WIDTH,
        height: size.height - DEFAULT_MARGIN * 2 + 6,
      },
      style: {
        opacity: 0,
      },
    },
  ],
});
