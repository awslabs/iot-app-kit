import { v4 as uuid } from 'uuid';
import {
  DEFAULT_MARGIN,
  TREND_CURSOR_CLOSE_BUTTON_X_OFFSET,
  TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET,
  TREND_CURSOR_CLOSE_GRAPHIC_INDEX,
  TREND_CURSOR_DELETE_BUTTON_HEIGHT,
  TREND_CURSOR_HEADER_BACKGROUND_COLOR,
  TREND_CURSOR_HEADER_COLORS,
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
  GraphicComponentTextOption,
  GraphicComponentZRPathOption,
} from 'echarts/types/src/component/graphic/GraphicModel';
import {
  calculateTimeStamp,
  calculateTrendCursorsSeriesMakers,
  getTrendCursorHeaderTimestampText,
  setXWithBounds,
} from './getInfo';

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
  return headerGraphic;
};
const updateTrendCursorLineMarkers = (
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
export const onDragUpdateTrendCursor = ({ graphic, posX, timeInMs, series, size, ref }: ondragUpdateGraphicProps) => {
  // calculate the new Y for the series markers
  const { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue } = calculateTrendCursorsSeriesMakers(
    series,
    timeInMs,
    ref
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
  ((elements[TREND_CURSOR_LINE_GRAPHIC_INDEX] as GraphicComponentZRPathOption).shape ?? {}).y2 =
    size.height - DEFAULT_MARGIN;
  return updateTrendCursorLineMarkers(elements, trendCursorsSeriesMakersInPixels);
};

// this function return the TC line and the ondrag handles the user dragging action
const addTCLine = (uId: string, size: SizeConfig) => ({
  type: 'line',
  z: TREND_CURSOR_Z_INDEX,
  id: `line-${uId}`,
  draggable: 'horizontal' as const,
  shape: {
    y1: DEFAULT_MARGIN,
    y2: size.height - DEFAULT_MARGIN,
  },
  style: {
    stroke: TREND_CURSOR_LINE_COLOR,
    lineWidth: TREND_CURSOR_LINE_WIDTH,
  },
});
const addTCHeader = (uId: string, timestampInMs: number, headerColor: string): GraphicComponentTextOption => ({
  type: 'text',
  z: TREND_CURSOR_Z_INDEX + 1,
  id: `text-${uId}`,
  style: {
    y: TREND_CURSOR_HEADER_OFFSET,
    text: getTrendCursorHeaderTimestampText(timestampInMs),
    fill: TREND_CURSOR_HEADER_TEXT_COLOR,
    align: 'center',
    rich: {
      title: {
        width: TREND_CURSOR_HEADER_WIDTH + 5, // width plus padding
        backgroundColor: headerColor,
        height: 6,
      },
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
  // mouse events are disabled for the header
  silent: true,
});

const addTCDeleteButton = (uId: string): GraphicComponentZRPathOption => ({
  id: `polyline-${uId}`,
  type: 'polyline',
  z: TREND_CURSOR_Z_INDEX + 1,
  x: TREND_CURSOR_CLOSE_BUTTON_X_OFFSET,
  y: TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET,
  shape: {
    points: [
      [0, 0],
      [TREND_CURSOR_DELETE_BUTTON_HEIGHT, TREND_CURSOR_DELETE_BUTTON_HEIGHT],
      [TREND_CURSOR_DELETE_BUTTON_HEIGHT / 2, TREND_CURSOR_DELETE_BUTTON_HEIGHT / 2],
      [TREND_CURSOR_DELETE_BUTTON_HEIGHT, 0],
      [0, TREND_CURSOR_DELETE_BUTTON_HEIGHT],
      [TREND_CURSOR_DELETE_BUTTON_HEIGHT / 2, TREND_CURSOR_DELETE_BUTTON_HEIGHT / 2],
    ],
  },
  style: {
    stroke: 'white',
    opacity: 1,
    lineWidth: 2,
  },
});

const addTCMarkers = (uId: string, yAxisMarkers: number[], series: SeriesOption[]) =>
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
  tcHeaderColorIndex,
  series,
  viewportInMs,
  tcId,
  x,
  timestamp,
  ref,
}: GetNewTrendCursorProps) => {
  const posX = e?.offsetX ?? x ?? 0;
  const uId = tcId ? tcId.split('trendCursor-')[1] : uuid();
  // TODO: test this once echarts live mode is supported
  const timestampInMs = timestamp ?? calculateTimeStamp(posX, size.width, viewportInMs);

  const boundedX = setXWithBounds(size, posX);
  // TODO: test this once echarts live mode is supported
  const { trendCursorsSeriesMakersValue, trendCursorsSeriesMakersInPixels } = calculateTrendCursorsSeriesMakers(
    series,
    timestampInMs,
    ref
  );
  // rotate the colors in a round-robin fashion
  const headerColor = TREND_CURSOR_HEADER_COLORS[tcHeaderColorIndex % TREND_CURSOR_HEADER_COLORS.length];
  return {
    id: tcId ?? `trendCursor-${uId}`,
    $action: 'merge' as const,
    type: 'group' as const,
    timestampInMs,
    yAxisMarkerValue: trendCursorsSeriesMakersValue,
    headerColor,
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
      addTCHeader(uId, timestampInMs, headerColor),
      addTCDeleteButton(uId),
      ...addTCMarkers(uId, trendCursorsSeriesMakersInPixels, series),
    ],
  };
};
