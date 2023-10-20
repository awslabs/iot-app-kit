import { useEffect, useState } from 'react';
import { Viewport } from '@iot-app-kit/core';
import { LIVE_MODE_REFRESH_RATE_MS } from '../eChartsConstants';
import { convertViewportToMs, isDurationViewport } from '../trendCursor/calculations/viewport';

export const useViewportToMS = (viewport?: Viewport) => {
  const [inMS, setInMS] = useState(convertViewportToMs(viewport));

  const viewportString = JSON.stringify(viewport);
  useEffect(() => {
    let interval: NodeJS.Timer;
    if (viewport && isDurationViewport(viewport)) {
      interval = setInterval(() => {
        setInMS(convertViewportToMs(viewport));
      }, LIVE_MODE_REFRESH_RATE_MS);
    } else {
      setInMS(convertViewportToMs(viewport));
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // disabling because viewport is stringified as viewportString
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportString]);

  return inMS;
};
