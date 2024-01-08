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
  (elements[TREND_CURSOR_LINE_GRAPHIC_INDEX] ?? {}).children = elements[
    TREND_CURSOR_LINE_GRAPHIC_INDEX
  ].children?.map((lineElement, index) => {
    if (index === 0) {
      (((lineElement ?? {}) as GraphicComponentZRPathOption).shape ?? {}).y2 =
        size.height - DEFAULT_MARGIN;
    } else {
      // refer to the creation of the line graphic the height is the size minus top and bottom white space
      (
        ((lineElement ?? {}) as GraphicComponentZRPathOption).shape ?? {}
      ).height = size.height - DEFAULT_MARGIN * 2 + 6;
    }
    return lineElement;
  });
  return updateTrendCursorLineMarkers(
    elements,
    trendCursorsSeriesMakersInPixels
  );
};
