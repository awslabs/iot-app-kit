import { useEffect, useState } from 'react';
import { isDurationViewport, convertViewportToMs } from '../utils/trendCursorCalculations';
import { Viewport } from '@iot-app-kit/core';
import { LIVE_MODE_REFRESH_RATE_MS } from '../eChartsConstants';

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
  }, [viewportString]);

  return inMS;
};
