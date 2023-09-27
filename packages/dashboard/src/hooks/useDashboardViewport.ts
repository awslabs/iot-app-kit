import { Viewport } from '@iot-app-kit/core';
import { useViewport } from '@iot-app-kit/react-components';
import { useEffect } from 'react';

export const useDashboardViewport = (viewport: Viewport | undefined) => {
  const { setViewport } = useViewport();
  useEffect(() => {
    if (!viewport) {
      return;
    }
    setViewport(viewport);
  }, [JSON.stringify(viewport)]);
};
