import { type Viewport, parseDuration } from '@iot-app-kit/core';
import { isDurationViewport } from './isDurationViewport';

// TODO: test this once echarts live mode is supported
// the width here represents the width of the view port in milli seconds
// and initial is the start timestamp of the viewport
export const convertViewportToMs = (viewport?: Viewport) => {
  const isDuration = !!viewport && isDurationViewport(viewport);
  if (isDuration) {
    const duration = parseDuration(viewport.duration);
    return {
      widthInMs: duration,
      initial: Date.now() - duration,
      end: Date.now(),
      isDurationViewport: isDuration,
    };
  } else {
    const start = new Date(viewport?.start ?? 0).getTime();
    const end = new Date(viewport?.end ?? 0).getTime();
    return {
      widthInMs: end - start,
      initial: start,
      end,
      isDurationViewport: isDuration,
    };
  }
};
