import {
  Viewport,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';

export const viewportAsInterval = (viewport: Viewport) => ({
  start: viewportStartDate(viewport),
  end: viewportEndDate(viewport),
});
