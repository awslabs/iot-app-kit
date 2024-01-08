import {
  TREND_CURSOR_HEADER_BACKGROUND_COLOR,
  TREND_CURSOR_HEADER_OFFSET,
  TREND_CURSOR_HEADER_TEXT_COLOR,
  TREND_CURSOR_HEADER_WIDTH,
  TREND_CURSOR_Z_INDEX,
} from '../../../constants';
import { getTrendCursorHeaderTimestampText } from '../../../calculations/timestamp';

export const addTCHeader = (
  uId: string,
  timestampInMs: number,
  color?: string
) => ({
  type: 'group',
  id: `header-${uId}`,
  draggable: 'horizontal' as const,
  children: [
    {
      type: 'text',
      z: TREND_CURSOR_Z_INDEX + 1,
      id: `text-${uId}`,
      style: {
        y: TREND_CURSOR_HEADER_OFFSET,
        text: getTrendCursorHeaderTimestampText(timestampInMs),
        fill: TREND_CURSOR_HEADER_TEXT_COLOR,
        align: 'center',
        rich: {
          timestamp: {
            width: TREND_CURSOR_HEADER_WIDTH,
            backgroundColor: TREND_CURSOR_HEADER_BACKGROUND_COLOR,
            height: 16,
            fontSize: 9,
            fontWeight: 'bold',
            align: 'left',
            padding: [1, 0, 0, 5],
          },
        },
      },
    },
    {
      type: 'rect',
      id: `header-rect-${uId}`,
      z: TREND_CURSOR_Z_INDEX + 2,
      shape: {
        x: -TREND_CURSOR_HEADER_WIDTH / 2 - 2.5,
        y: TREND_CURSOR_HEADER_OFFSET + 17,
        width: TREND_CURSOR_HEADER_WIDTH + 5,
        height: 6,
      },
      style: {
        fill: color,
        lineWidth: 0,
      },
    },
  ],
});
