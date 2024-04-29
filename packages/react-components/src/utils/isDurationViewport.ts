import { DurationViewport, Viewport } from '@iot-app-kit/core';

export const isDurationViewport = (
  viewport: Viewport
): viewport is DurationViewport =>
  (viewport as DurationViewport).duration !== undefined;
