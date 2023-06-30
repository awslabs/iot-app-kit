import { DurationViewport, Viewport } from '@iot-app-kit/core/src';
import { v4 as uuid } from 'uuid';
import { DEFAULT_MARGIN, trendCursorLineColor, trendCursorLineWidth, trendCursorZIndex } from '../eChartsConstants';
import { ElementEvent } from 'echarts';
import { SizeConfig } from '../types';
import { parseDuration } from '../../../utils/time';
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

// this returns a Graphic element of Echarts (https://echarts.apache.org/en/option.html#graphic)
// A Trend cursor is a custom Graphic group element,
// which has a line and other elements which gets rendered on the screen.
// for now, we are storing the timestamp of the trend cursor in graphic element
// which will eventually be moved to state(redux)
export const addNewTrendCursor = (e: ElementEvent, size: SizeConfig, viewport: Viewport | undefined) => ({
  id: `trendCursor-${uuid()}`,
  action: '$merge',
  type: 'group',
  timestampInMs: calculateTimeStamp(e.offsetX, size?.width, viewport),
  children: [
    {
      type: 'line',
      z: trendCursorZIndex,
      id: `line-${uuid()}`,
      shape: {
        x1: e.offsetX,
        x2: e.offsetX,
        y1: DEFAULT_MARGIN,
        y2: (size?.height ?? 0) - DEFAULT_MARGIN,
      },
      style: {
        stroke: trendCursorLineColor,
        lineWidth: trendCursorLineWidth,
      },
    },
    // TODO: need to add the line markers
    // TODO: need to add the TC header
  ],
  onDrag: () => {
    // TODO: need to update he timestamp when user drags the TC
  },
});
