import { LineSeriesOption, SeriesOption } from 'echarts';
import { GraphicComponentElementOption } from 'echarts/types/src/component/graphic/GraphicModel';
import {
  TREND_CURSOR_CLOSE_GRAPHIC_INDEX,
  TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX,
  TREND_CURSOR_MARKER_RADIUS,
  TREND_CURSOR_Z_INDEX,
} from '../../../constants';

const addTCMarker = ({
  index,
  uId,
  markerValueInPixel,
  series,
}: {
  uId: string;
  markerValueInPixel: number;
  series: SeriesOption[];
  index: number;
}) => {
  return {
    id: `circle-${index}-${uId}`,
    type: 'circle',
    ignore: (series[index] as LineSeriesOption).lineStyle?.opacity === 0,
    z: TREND_CURSOR_Z_INDEX + 1,
    y: markerValueInPixel,
    shape: {
      r: TREND_CURSOR_MARKER_RADIUS,
    },
    style: {
      fill: (series[index] as LineSeriesOption)?.lineStyle?.color,
    },
  };
};

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
  for (
    let i = TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX;
    i < elements.length;
    i++
  ) {
    elements[i].y =
      trendCursorsSeriesMakersInPixels[
        i - TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX
      ];
  }
  return elements;
};

export const upsertTrendCursorLineMarkers = (
  elements: GraphicComponentElementOption[],
  trendCursorsSeriesMakersInPixels: number[],
  series: SeriesOption[]
) => {
  // read all the non-marker elements
  const newElements = [
    ...elements.slice(0, TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX),
  ];

  // read the unique Id from the delete button, which is in the format delete-button-uuid
  const uId =
    elements[TREND_CURSOR_CLOSE_GRAPHIC_INDEX].id
      ?.toString()
      .split('delete-button-')[1] ?? '';
  // add the new markers
  for (let i = 0; i < trendCursorsSeriesMakersInPixels.length; i++) {
    newElements.push(
      addTCMarker({
        uId,
        markerValueInPixel: trendCursorsSeriesMakersInPixels[i],
        index: i,
        series,
      })
    );
  }

  // ********************************************************************************
  // if any of the markers need to delete when the user removes a series, we need to remove that marker
  // because of the default merge of echarts, setting $action to remove does not work
  // so as a workaround we are setting the marker's ignore flag to true
  // ********************************************************************************
  if (newElements.length < elements.length) {
    const delta = elements.length - newElements.length;
    for (let i = elements.length - 1; i > elements.length - 1 - delta; i--) {
      elements[i].ignore = true;
      newElements.push(elements[i]);
    }
  }

  return newElements;
};

export const addTCMarkers = (
  uId: string,
  yAxisMarkers: number[],
  series: SeriesOption[]
) =>
  yAxisMarkers.map((marker, index) => ({
    id: `circle-${index}-${uId}`,
    type: 'circle',
    z: TREND_CURSOR_Z_INDEX + 1,
    y: marker,
    ignore: (series[index] as LineSeriesOption).lineStyle?.opacity === 0,
    shape: {
      r: TREND_CURSOR_MARKER_RADIUS,
    },
    style: {
      fill: (series[index] as LineSeriesOption)?.lineStyle?.color,
    },
  }));
