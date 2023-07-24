import { v4 as uuid } from 'uuid';
import {
  DEFAULT_MARGIN,
  TREND_CURSOR_CLOSE_BUTTON_X_OFFSET,
  TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET,
  TREND_CURSOR_CLOSE_GRAPHIC_INDEX,
  TREND_CURSOR_HEADER_BACKGROUND_COLOR,
  TREND_CURSOR_HEADER_COLORS,
  TREND_CURSOR_HEADER_GRAPHIC_INDEX,
  TREND_CURSOR_HEADER_TEXT_COLOR,
  TREND_CURSOR_HEADER_WIDTH,
  TREND_CURSOR_LINE_COLOR,
  TREND_CURSOR_LINE_GRAPHIC_INDEX,
  TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX,
  TREND_CURSOR_LINE_WIDTH,
  TREND_CURSOR_MARKER_RADIUS,
  TREND_CURSOR_Z_INDEX,
} from './eChartsConstants';
import { EChartsType, ElementEvent, LineSeriesOption, SeriesOption } from 'echarts';
import { ChartEventType, InternalGraphicComponentGroupOption, SizeConfig } from './types';
import { Dispatch, SetStateAction } from 'react';
import close from './close.svg';
import {
  GraphicComponentElementOption,
  GraphicComponentImageOption,
  GraphicComponentTextOption,
  GraphicComponentZRPathOption,
} from 'echarts/types/src/component/graphic/GraphicModel';
import { Viewport } from '@iot-app-kit/core';
import {
  calculateTimeStamp,
  calculateTrendCursorsSeriesMakers,
  getTrendCursorHeaderTimestampText,
  setXWithBounds,
} from './utils/getInfo';

export type ondragUpdateGraphicProps = {
  graphic: InternalGraphicComponentGroupOption;
  event: ChartEventType;
  timeInMs: number;
  size: SizeConfig;
  series: SeriesOption[];
  yMin: number;
  yMax: number;
};
export type ondragUpdateTrendCursorElementsProps = {
  elements: GraphicComponentElementOption[];
  trendCursorsSeriesMakersInPixels: number[];
  timeInMs: number;
};

const ondragUpdateTrendCursorLine = (elements: GraphicComponentElementOption[]) => {
  // specifically setting the line graphic x value to 0 so that it follows the parent's X
  const lineGraphic = elements[TREND_CURSOR_LINE_GRAPHIC_INDEX];
  lineGraphic.x = 0;
  return lineGraphic;
};

const ondragUpdateTrendCursorHeaderText = (elements: GraphicComponentElementOption[], timeInMs: number) => {
  const headerGraphic = elements[TREND_CURSOR_HEADER_GRAPHIC_INDEX];
  // update the timestamp on the header
  (headerGraphic as GraphicComponentTextOption).style = {
    ...(headerGraphic as GraphicComponentTextOption).style,
    text: getTrendCursorHeaderTimestampText(timeInMs, (headerGraphic as GraphicComponentTextOption).style?.text),
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
const ondragUpdateTrendCursorElements = ({
  elements,
  trendCursorsSeriesMakersInPixels,
  timeInMs,
}: ondragUpdateTrendCursorElementsProps) => {
  return [
    ondragUpdateTrendCursorLine(elements),
    ondragUpdateTrendCursorHeaderText(elements, timeInMs),
    ...updateTrendCursorLineMarkers(elements, trendCursorsSeriesMakersInPixels).slice(
      TREND_CURSOR_CLOSE_GRAPHIC_INDEX,
      elements.length
    ),
  ];
};
const ondragUpdateTrendCursor = ({ graphic, event, timeInMs, series, size, yMin, yMax }: ondragUpdateGraphicProps) => {
  // calculate the new Y for the series markers
  const { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue } = calculateTrendCursorsSeriesMakers(
    series,
    yMax,
    yMin,
    timeInMs,
    size.height
  );

  // this section updates the internal data of graphic, this data is used to render the legend component data
  // update the X value of the TC
  graphic.x = setXWithBounds(size, event.offsetX ?? 0);
  // add the timestamp to graphic for future use
  graphic.timestampInMs = timeInMs;
  graphic.yAxisMarkerValue = trendCursorsSeriesMakersValue;

  return {
    ...graphic,
    children: ondragUpdateTrendCursorElements({
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
const addTCLine = (
  uId: string,
  graphic: InternalGraphicComponentGroupOption[],
  size: SizeConfig,
  series: SeriesOption[],
  yMax: number,
  yMin: number,
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>,
  viewport?: Viewport
) => ({
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
  ondrag: (event: ChartEventType) => {
    const graphicIndex = graphic.findIndex((g) => g.children[0].id === event.target.id);
    const timeInMs = calculateTimeStamp(event.offsetX ?? 0, size.width, viewport);

    // update current TC
    graphic[graphicIndex] = ondragUpdateTrendCursor({
      graphic: graphic[graphicIndex],
      event,
      timeInMs,
      size,
      series,
      yMax,
      yMin,
    });
    // update component state
    setGraphic([...graphic]);
  },
});

const addTCHeader = (
  uId: string,
  timestampInMs: number,
  tcCount: number,
  headerColor: string
): GraphicComponentTextOption => ({
  type: 'text',
  z: TREND_CURSOR_Z_INDEX + 1,
  id: `text-${uId}`,
  style: {
    y: DEFAULT_MARGIN,
    text: getTrendCursorHeaderTimestampText(timestampInMs, `{title|Trend cursor ${tcCount + 1}  }`),
    lineHeight: 16,
    fill: TREND_CURSOR_HEADER_TEXT_COLOR,
    align: 'center',
    rich: {
      title: {
        width: TREND_CURSOR_HEADER_WIDTH,
        backgroundColor: headerColor,
        height: 20,
        fontSize: 12,
      },
      timestamp: {
        width: TREND_CURSOR_HEADER_WIDTH,
        backgroundColor: TREND_CURSOR_HEADER_BACKGROUND_COLOR,
        height: 15,
        fontSize: 9,
        fontWeight: 'bold',
      },
    },
  },
});

const addTCDeleteButton = (
  uId: string,
  graphic: InternalGraphicComponentGroupOption[],
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>,
  chart?: EChartsType
): GraphicComponentImageOption => ({
  id: `image-${uId}`,
  type: 'image',
  z: TREND_CURSOR_Z_INDEX + 1,
  x: TREND_CURSOR_CLOSE_BUTTON_X_OFFSET,
  y: TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET,
  style: {
    image: close as unknown as string,
  },
  onmousedown: (event: ChartEventType) => {
    const graphicIndex = graphic.findIndex((g) => g.children[TREND_CURSOR_CLOSE_GRAPHIC_INDEX].id === event.target.id);
    graphic[graphicIndex].$action = 'remove';
    graphic[graphicIndex].children = []; // Echarts will throw error if children are not empty
    chart?.setOption({ graphic });
    graphic.splice(graphicIndex, 1);
    setGraphic([...graphic]);
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
const addNewTrendCursor = (
  e: ElementEvent,
  size: SizeConfig,
  count: number,
  graphic: InternalGraphicComponentGroupOption[],
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>,
  series: SeriesOption[],
  yMax: number,
  yMin: number,
  viewport?: Viewport,
  chart?: EChartsType
) => {
  const uId = uuid();
  // TODO: test this once echarts live mode is supported
  const timestampInMs = calculateTimeStamp(e.offsetX, size.width, viewport);
  const boundedX = setXWithBounds(size, e.offsetX ?? 0);
  // TODO: test this once echarts live mode is supported
  const { trendCursorsSeriesMakersValue, trendCursorsSeriesMakersInPixels } = calculateTrendCursorsSeriesMakers(
    series,
    yMax,
    yMin,
    timestampInMs,
    size.height
  );
  // rotate the colors in a round-robin fashion
  const headerColor = TREND_CURSOR_HEADER_COLORS[count % TREND_CURSOR_HEADER_COLORS.length];
  const newTC = {
    id: `trendCursor-${uId}`,
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
      addTCLine(uId, graphic, size, series, yMax, yMin, setGraphic, viewport),
      addTCHeader(uId, timestampInMs, count, headerColor),
      addTCDeleteButton(uId, graphic, setGraphic, chart),
      ...addTCMarkers(uId, trendCursorsSeriesMakersInPixels, series),
    ],
  };

  graphic.push(newTC);
  return graphic;
};

export default addNewTrendCursor;
