import {
  type HistoricalViewport,
  parseDuration,
  type Viewport,
} from '@iot-app-kit/core';

export const convertViewportToHistoricalViewport = (
  passedInViewport: Viewport,
  timeOfRequest: number
): HistoricalViewport => {
  if ('duration' in passedInViewport) {
    return {
      start: new Date(timeOfRequest - parseDuration(passedInViewport.duration)),
      end: new Date(timeOfRequest),
    };
  } else {
    const { start, end } = passedInViewport;
    return {
      start,
      end: end.getTime() > timeOfRequest ? new Date(timeOfRequest) : end,
    };
  }
};
