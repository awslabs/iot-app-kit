import { DurationViewport, Viewport } from '@iot-app-kit/core/src';
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
  trendCursorZIndex,
} from '../eChartsConstants';
import { EChartsType, ElementEvent } from 'echarts';
import { ChartEventType, InternalGraphicComponentGroupOption, SizeConfig } from '../types';
import { parseDuration } from '../../../utils/time';
import close from '../close.svg';
import { Dispatch, SetStateAction } from 'react';
import { GraphicComponentTextOption } from 'echarts/types/src/component/graphic/GraphicModel';

export const isDurationViewport = (viewport: Viewport): viewport is DurationViewport =>
  (viewport as DurationViewport).duration !== undefined;

// TODO: test this once echarts live mode is supported
// the width here represents the width of the view port in milli seconds
// and initial is the start timestamp of the viewport
export const viewportToMs = (viewport?: Viewport) => {
  if (viewport && isDurationViewport(viewport)) {
    return { widthInMs: parseDuration(viewport.duration), initial: Date.now() - parseDuration(viewport.duration) };
  } else {
    const start = new Date(viewport?.start ?? 0).getTime();
    const end = new Date(viewport?.end ?? 0).getTime();
    return {
      widthInMs: end - start,
      initial: start,
    };
  }
};

// this function calculated the timestamp of the location of the user click.
// the timestamp is calculated based on the viewport and X value of the click point[x, y]
// this is a simple linear interpolation
export const calculateTimeStamp = (xInPixel: number, widthInPixel: number, viewport?: Viewport) => {
  const { widthInMs, initial } = viewportToMs(viewport);
  // TODO: this results in a decimal , needs to decide precision
  const delta = (widthInMs * (xInPixel - DEFAULT_MARGIN)) / (widthInPixel - 2 * DEFAULT_MARGIN);
  return delta + initial;
};

// this function is limiting the horizontal x-axis movement of the TC
// this is not limiting the line's movement but only the TC header movement
export const setXWithBounds = (size: SizeConfig, x: number) => {
  const upperLimit = size.width - DEFAULT_MARGIN;
  const lowerLimit = DEFAULT_MARGIN;
  return x > upperLimit ? upperLimit : x < lowerLimit ? lowerLimit : x;
};

export const getTrendCursorHeaderTimestampText = (timestampInMs: number, previousText?: string) => {
  const title = previousText && previousText.split('\n')[0];
  return [
    title,
    `{timestamp|${new Date(timestampInMs).toLocaleDateString()} ${new Date(timestampInMs).toLocaleTimeString()}}`,
  ].join('\n');
};
// this returns a Graphic element of Echarts (https://echarts.apache.org/en/option.html#graphic)
// A Trend cursor is a custom Graphic group element,
// which has a line and other elements which gets rendered on the screen.
// for now, we are storing the timestamp of the trend cursor in graphic element
// which will eventually be moved to state(redux)
export const addNewTrendCursor = (
  e: ElementEvent,
  size: SizeConfig,
  count: number,
  graphic: InternalGraphicComponentGroupOption[],
  setGraphic: Dispatch<SetStateAction<InternalGraphicComponentGroupOption[]>>,
  viewport?: Viewport,
  chart?: EChartsType
) => {
  const uId = uuid();
  const timestampInMs = calculateTimeStamp(e.offsetX, size.width, viewport);
  const boundedX = setXWithBounds(size, e.offsetX ?? 0);
  const newTC = {
    id: `trendCursor-${uId}`,
    $action: 'merge',
    type: 'group' as const,
    timestampInMs,
    children: [
      {
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
          graphic[graphicIndex].children[1].x = setXWithBounds(size, event.offsetX ?? 0);
          graphic[graphicIndex].children[2].x = setXWithBounds(size, event.offsetX ?? 0) + 40;

          graphic[graphicIndex].children[1].style = {
            ...graphic[graphicIndex].children[1].style,
            text: getTrendCursorHeaderTimestampText(
              timeInMs,
              (graphic[graphicIndex].children[1] as GraphicComponentTextOption).style?.text
            ),
          };
          graphic[graphicIndex].timestampInMs = calculateTimeStamp(e.offsetX ?? 0, size.width, viewport);
          chart?.setOption({ graphic });
          setGraphic(graphic);
        },
      },
      {
        type: 'text',
        z: trendCursorZIndex + 1,
        id: `text-${uId}`,
        x: boundedX,
        style: {
          y: DEFAULT_MARGIN,
          text: getTrendCursorHeaderTimestampText(timestampInMs, `{title|Trend cursor ${count + 1}  }`),
          lineHeight: 16,
          fill: trendCursorHeaderTextColor,
          align: 'center',
          rich: {
            title: {
              width: trendCursorHeaderWidth,
              backgroundColor: trendCursorHeaderColors[count],
              height: 20,
              fontSize: 12,
            },
            timestamp: {
              width: trendCursorHeaderWidth,
              backgroundColor: trendCursorHeaderBackgroundColor,
              height: 15,
              fontSize: 9,
              FontWeight: 'bold',
            },
          },
        },
      },
      {
        id: `image-${uId}`,
        type: 'image',
        z: trendCursorZIndex + 1,
        x: boundedX + trendCursorCloseButtonXOffset,
        y: trendCursorCloseButtonYOffset,
        style: {
          image: close,
        },
        onmousedown: (event: ChartEventType) => {
          const graphicIndex = graphic.findIndex((g) => g.children[2].id === event.target.id);
          graphic[graphicIndex].$action = 'remove';
          graphic[graphicIndex].children = []; // Echarts will throw error if children are not empty
          chart?.setOption({ graphic });
          graphic.splice(graphicIndex, 1);
          setGraphic(graphic);
        },
      },
      // having the TC header as a different graphic given it will have a different on-click handler
      // TODO: need to add the line markers
    ],
  };

  graphic.push(newTC);
  return graphic;
};
