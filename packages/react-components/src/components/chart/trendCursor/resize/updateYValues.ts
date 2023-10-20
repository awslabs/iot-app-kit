import {
  GraphicComponentElementOption,
  GraphicComponentZRPathOption,
} from 'echarts/types/src/component/graphic/GraphicModel';
import { SizeConfig } from '../../types';
import { TREND_CURSOR_LINE_GRAPHIC_INDEX } from '../constants';
import { DEFAULT_MARGIN } from '../../eChartsConstants';
import { updateTrendCursorLineMarkers } from '../getTrendCursor/components/markers';

export const onResizeUpdateTrendCursorYValues = (
  elements: GraphicComponentElementOption[],
  trendCursorsSeriesMakersInPixels: number[],
  size: SizeConfig
) => {
  (elements[TREND_CURSOR_LINE_GRAPHIC_INDEX] ?? {}).children = elements[TREND_CURSOR_LINE_GRAPHIC_INDEX].children?.map(
    (lineElement, index) => {
      if (index === 0) {
        (((lineElement ?? {}) as GraphicComponentZRPathOption).shape ?? {}).y2 = size.height - DEFAULT_MARGIN;
      } else {
        lineElement.y = size.height - DEFAULT_MARGIN - 6;
      }
      return lineElement;
    }
  );
  return updateTrendCursorLineMarkers(elements, trendCursorsSeriesMakersInPixels);
};
