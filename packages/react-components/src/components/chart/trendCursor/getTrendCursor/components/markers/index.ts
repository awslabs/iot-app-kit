import { LineSeriesOption, SeriesOption } from 'echarts';
import { GraphicComponentElementOption } from 'echarts/types/src/component/graphic/GraphicModel';
import {
  TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX,
  TREND_CURSOR_MARKER_RADIUS,
  TREND_CURSOR_Z_INDEX,
} from '../../../constants';

export const updateTrendCursorLineMarkers = (
  elements: GraphicComponentElementOption[],
  trendCursorsSeriesMakersInPixels: number[]
) => {
  // update the Y of the series markers
  //                              childIndex            --> purpose
  // -----------------------------------------------------------------------
  //            TREND_CURSOR_LINE_GRAPHIC_INDEX         --> line
  //            TREND_CURSOR_HEADER_GRAPHIC_INDEX       --> TC header
  //            TREND_CURSOR_CLOSE_GRAPHIC_INDEX        --> close button
  // from index TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX --> series markers
  for (let i = TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX; i < elements.length; i++) {
    elements[i].y = trendCursorsSeriesMakersInPixels[i - TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX];
  }
  return elements;
};
export const addTCMarkers = (uId: string, yAxisMarkers: number[], series: SeriesOption[]) =>
  yAxisMarkers.map((marker, index) => ({
    id: `circle-${index}-${uId}`,
    type: 'circle',
    z: TREND_CURSOR_Z_INDEX + 1,
    y: marker,
    shape: {
      r: TREND_CURSOR_MARKER_RADIUS,
    },
    style: {
      fill: (series[index] as LineSeriesOption)?.lineStyle?.color,
    },
  }));
