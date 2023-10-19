import { v4 as uuid } from 'uuid';
import {
  DEFAULT_MARGIN,
  TREND_CURSOR_CLOSE_BUTTON_X_OFFSET,
  TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET,
  TREND_CURSOR_CLOSE_GRAPHIC_INDEX,
  TREND_CURSOR_DRAG_RECT_WIDTH,
  TREND_CURSOR_HEADER_BACKGROUND_COLOR,
  TREND_CURSOR_HEADER_GRAPHIC_INDEX,
  TREND_CURSOR_HEADER_OFFSET,
  TREND_CURSOR_HEADER_TEXT_COLOR,
  TREND_CURSOR_HEADER_WIDTH,
  TREND_CURSOR_LINE_COLOR,
  TREND_CURSOR_LINE_GRAPHIC_INDEX,
  TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX,
  TREND_CURSOR_LINE_WIDTH,
  TREND_CURSOR_MARKER_RADIUS,
  TREND_CURSOR_Z_INDEX,
} from '../eChartsConstants';
import { LineSeriesOption, SeriesOption } from 'echarts';
import {
  GetNewTrendCursorProps,
  ondragUpdateGraphicProps,
  ondragUpdateTrendCursorElementsProps,
  SizeConfig,
} from '../types';
import {
  GraphicComponentElementOption,
  GraphicComponentImageOption,
  GraphicComponentTextOption,
  GraphicComponentZRPathOption,
} from 'echarts/types/src/component/graphic/GraphicModel';
import {
  calculateTimeStamp,
  calculateTrendCursorsSeriesMakers,
  getTrendCursorHeaderTimestampText,
  setXWithBounds,
} from './trendCursorCalculations';

import deleteButtonSvg from './Icon.svg';

const onDragUpdateTrendCursorLine = (elements: GraphicComponentElementOption[]) => {
  // specifically setting the line graphic x value to 0 so that it follows the parent's X
  const lineGraphic = elements[TREND_CURSOR_LINE_GRAPHIC_INDEX];
  lineGraphic.x = 0;
  return lineGraphic;
};

const onDragUpdateTrendCursorHeaderText = (elements: GraphicComponentElementOption[], timeInMs: number) => {
  const headerGraphic = elements[TREND_CURSOR_HEADER_GRAPHIC_INDEX];
  // update the timestamp on the header
  (headerGraphic as GraphicComponentTextOption).style = {
    ...(headerGraphic as GraphicComponentTextOption).style,
    text: getTrendCursorHeaderTimestampText(timeInMs),
  };
  headerGraphic.x = 0;
  return headerGraphic;
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
  for (let i = TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX; i < elements.length; i++) {
    elements[i].y = trendCursorsSeriesMakersInPixels[i - TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX];
  }
  return elements;
};
const onDragUpdateTrendCursorElements = ({
  elements,
  trendCursorsSeriesMakersInPixels,
  timeInMs,
}: ondragUpdateTrendCursorElementsProps) => {
  return [
    onDragUpdateTrendCursorLine(elements),
    onDragUpdateTrendCursorHeaderText(elements, timeInMs),
    ...updateTrendCursorLineMarkers(elements, trendCursorsSeriesMakersInPixels).slice(
      TREND_CURSOR_CLOSE_GRAPHIC_INDEX,
      elements.length
    ),
  ];
};
export const onDragUpdateTrendCursor = ({
  graphic,
  posX,
  timeInMs,
  series,
  size,
  chartRef,
  visualization,
}: ondragUpdateGraphicProps) => {
  // calculate the new Y for the series markers
  const { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue } = calculateTrendCursorsSeriesMakers(
    series,
    timeInMs,
    chartRef,
    visualization
  );

  // this section updates the internal data of graphic, this data is used to render the legend component data
  // update the X value of the TC
  graphic.x = setXWithBounds(size, posX);
  // add the timestamp to graphic for future use
  graphic.timestampInMs = timeInMs;
  graphic.yAxisMarkerValue = trendCursorsSeriesMakersValue;

  return {
    ...graphic,
    children: onDragUpdateTrendCursorElements({
      elements: graphic.children,
      trendCursorsSeriesMakersInPixels,
      timeInMs,
    }),
  };
};

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

// this function return the TC line and the ondrag handles the user dragging action
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
export const addTCHeader = (uId: string, timestampInMs: number): GraphicComponentTextOption => ({
  type: 'text',
  z: TREND_CURSOR_Z_INDEX + 1,
  id: `text-${uId}`,
  draggable: 'horizontal' as const,
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
});

export const addTCDeleteButton = (uId: string): GraphicComponentImageOption => ({
  id: `delete-button-${uId}`,
  type: 'image',
  z: TREND_CURSOR_Z_INDEX + 1,
  x: TREND_CURSOR_CLOSE_BUTTON_X_OFFSET,
  y: TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET,
  style: {
    image: deleteButtonSvg as unknown as string,
  },
});

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

// this returns a Graphic element of Echarts (https://echarts.apache.org/en/option.html#graphic)
// A Trend cursor is a custom Graphic group element,
// which has a line and other elements which gets rendered on the screen.
// for now, we are storing the timestamp of the trend cursor in graphic element
// which will eventually be moved to state(redux)
export const getNewTrendCursor = ({
  e,
  size,
  series,
  tcId,
  x,
  timestamp,
  chartRef,
  visualization,
}: GetNewTrendCursorProps) => {
  const posX = e?.offsetX ?? x ?? 0;
  const uId = tcId ? tcId.split('trendCursor-')[1] : uuid();
  const timestampInMs = timestamp ?? calculateTimeStamp(posX, chartRef);
  const boundedX = setXWithBounds(size, posX);

  const { trendCursorsSeriesMakersValue, trendCursorsSeriesMakersInPixels } = calculateTrendCursorsSeriesMakers(
    series,
    timestampInMs,
    chartRef,
    visualization
  );

  // this check makes sure that the chart lines are rendered first and only then we render the TC markers
  // this avoids the re-render issue because of changing key on change in query
  // without this check, we see that the TC's X will default to left and no markers
  if (trendCursorsSeriesMakersInPixels.every((v) => v === 0)) {
    return undefined;
  }
  // rotate the colors in a round-robin fashion
  return {
    id: tcId ?? `trendCursor-${uId}`,
    $action: 'merge' as const,
    type: 'group' as const,
    timestampInMs,
    yAxisMarkerValue: trendCursorsSeriesMakersValue,
    x: boundedX,
    // update the Y of the series markers
    //   childIndex --> purpose
    // -----------------------------
    //     0        --> line
    //     1        --> TC header
    //     2        --> close button
    // from index 3 --> series markers
    children: [
      addTCLine(uId, size),
      addTCHeader(uId, timestampInMs),
      addTCDeleteButton(uId),
      ...addTCMarkers(uId, trendCursorsSeriesMakersInPixels, series),
    ],
  };
};
