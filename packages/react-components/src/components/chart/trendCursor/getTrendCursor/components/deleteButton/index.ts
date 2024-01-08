import { GraphicComponentImageOption } from 'echarts/types/src/component/graphic/GraphicModel';
import deleteButtonSvg from './Icon.svg';
import {
  TREND_CURSOR_CLOSE_BUTTON_X_OFFSET,
  TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET,
  TREND_CURSOR_Z_INDEX,
} from '../../../constants';

export const addTCDeleteButton = (
  uId: string
): GraphicComponentImageOption => ({
  id: `delete-button-${uId}`,
  type: 'image',
  z: TREND_CURSOR_Z_INDEX + 1,
  x: TREND_CURSOR_CLOSE_BUTTON_X_OFFSET,
  y: TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET,
  style: {
    image: deleteButtonSvg as unknown as string,
  },
});
