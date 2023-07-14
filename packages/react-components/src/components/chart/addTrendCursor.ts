import { v4 as uuid } from 'uuid';
import {
  DEFAULT_MARGIN,
  trendCursorCloseButtonXOffset,
  trendCursorCloseButtonYOffset,
  trendCursorHeaderBackgroundColor,
  trendCursorHeaderColors,
  trendCursorHeaderTextColor,
  trendCursorHeaderWidth,
  trendCursorLineColor,
  trendCursorLineWidth,
  trendCursorMarkerRadius,
  trendCursorZIndex,
} from './eChartsConstants';
import { EChartsType, ElementEvent, LineSeriesOption, SeriesOption } from 'echarts';
import { ChartEventType, InternalGraphicComponentGroupOption, SizeConfig } from './types';
import close from './close.svg';
import { Dispatch, SetStateAction } from 'react';
import {
  GraphicComponentImageOption,
  GraphicComponentTextOption,
} from 'echarts/types/src/component/graphic/GraphicModel';
import { Viewport } from '@iot-app-kit/core';
import {
  calculateTimeStamp,
  calculateTrendCursorsSeriesMakers,
  getTrendCursorHeaderTimestampText,
  setXWithBounds,
} from './utils/getInfo';

// this function return the TC line and the ondrag handles the user dragging action
const addTCLine = (
  uId: string,
  graphic: InternalGraphicComponentGroupOption[],
  size: SizeConfig,
  boundedX: number,
  series: SeriesOption[],
  yMax: number,
  yMin: number,
  e: ChartEventType,
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>,
  viewport?: Viewport,
  chart?: EChartsType
) => ({
  type: 'line',
  z: trendCursorZIndex,
  id: `line-${uId}`,
  draggable: 'horizontal' as const,
  shape: {
    x1: boundedX,
    x2: boundedX,
    y1: DEFAULT_MARGIN,
    y2: size.height - DEFAULT_MARGIN,
  },
  style: {
    stroke: trendCursorLineColor,
    lineWidth: trendCursorLineWidth,
  },
  ondrag: (event: ChartEventType) => {
    const graphicIndex = graphic.findIndex((g) => g.children[0].id === event.target.id);
    const timeInMs = calculateTimeStamp(event.offsetX ?? 0, size.width, viewport);

    // update the x of header and close button
    graphic[graphicIndex].children[1].x = setXWithBounds(size, event.offsetX ?? 0);
    graphic[graphicIndex].children[2].x = setXWithBounds(size, event.offsetX ?? 0) + trendCursorCloseButtonXOffset;

    // update the timestamp on the header
    graphic[graphicIndex].children[1].style = {
      ...graphic[graphicIndex].children[1].style,
      text: getTrendCursorHeaderTimestampText(
        timeInMs,
        (graphic[graphicIndex].children[1] as GraphicComponentTextOption).style?.text
      ),
    };
    // add the timestamp to graphic for future use
    graphic[graphicIndex].timestampInMs = calculateTimeStamp(e.offsetX ?? 0, size.width, viewport);

    // calculate the new Y for the series markers
    const onDragYAxisMarkers = calculateTrendCursorsSeriesMakers(series, yMax, yMin, timeInMs, size.height);

    // update the Y of the series markers
    //   childIndex --> purpose
    // -----------------------------
    //     0        --> line
    //     1        --> TC header
    //     2        --> close button
    // from index 3 --> series markers
    for (let i = 0; i < onDragYAxisMarkers.length; i++) {
      graphic[graphicIndex].children[i + 3].y = onDragYAxisMarkers[i];
      graphic[graphicIndex].children[i + 3].x = event.offsetX ?? 0;
    }
    // update echarts
    chart?.setOption({ graphic });

    // update component state
    setGraphic(graphic);
  },
});

const addTCHeader = (
  uId: string,
  boundedX: number,
  timestampInMs: number,
  tcCount: number
): GraphicComponentTextOption => ({
  type: 'text',
  z: trendCursorZIndex + 1,
  id: `text-${uId}`,
  x: boundedX,
  style: {
    y: DEFAULT_MARGIN,
    text: getTrendCursorHeaderTimestampText(timestampInMs, `{title|Trend cursor ${tcCount + 1}  }`),
    lineHeight: 16,
    fill: trendCursorHeaderTextColor,
    align: 'center',
    rich: {
      title: {
        width: trendCursorHeaderWidth,
        backgroundColor: trendCursorHeaderColors[tcCount],
        height: 20,
        fontSize: 12,
      },
      timestamp: {
        width: trendCursorHeaderWidth,
        backgroundColor: trendCursorHeaderBackgroundColor,
        height: 15,
        fontSize: 9,
        fontWeight: 'bold',
      },
    },
  },
});

const addTCDeleteButton = (
  uId: string,
  boundedX: number,
  graphic: InternalGraphicComponentGroupOption[],
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>,
  chart?: EChartsType
): GraphicComponentImageOption => ({
  id: `image-${uId}`,
  type: 'image',
  z: trendCursorZIndex + 1,
  x: boundedX + trendCursorCloseButtonXOffset,
  y: trendCursorCloseButtonYOffset,
  style: {
    image: close as unknown as string,
  },
  onmousedown: (event: ChartEventType) => {
    const graphicIndex = graphic.findIndex((g) => g.children[2].id === event.target.id);
    graphic[graphicIndex].$action = 'remove';
    graphic[graphicIndex].children = []; // Echarts will throw error if children are not empty
    chart?.setOption({ graphic });
    graphic.splice(graphicIndex, 1);
    setGraphic(graphic);
  },
});

const addTCMarkers = (uId: string, boundedX: number, yAxisMarkers: number[], series: SeriesOption[]) =>
  yAxisMarkers.map((marker, index) => ({
    id: `circle-${index}-${uId}`,
    type: 'circle',
    z: trendCursorZIndex + 1,
    x: boundedX,
    y: marker,
    shape: {
      r: trendCursorMarkerRadius,
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
  const yAxisMarkers = calculateTrendCursorsSeriesMakers(series, yMax, yMin, timestampInMs, size.height);
  const newTC = {
    id: `trendCursor-${uId}`,
    $action: 'merge',
    type: 'group' as const,
    timestampInMs,
    children: [
      addTCLine(uId, graphic, size, boundedX, series, yMax, yMin, e, setGraphic, viewport, chart),
      addTCHeader(uId, boundedX, timestampInMs, count) as GraphicComponentTextOption,
      addTCDeleteButton(uId, boundedX, graphic, setGraphic, chart) as GraphicComponentImageOption,
      ...addTCMarkers(uId, boundedX, yAxisMarkers, series),
    ],
  };

  graphic.push(newTC);
  return graphic;
};

export default addNewTrendCursor;
