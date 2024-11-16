import { type Viewport } from '@iot-app-kit/core';
import { useViewport } from '@iot-app-kit/react-components';
import { useEffect } from 'react';

export const useDashboardViewport = (viewport: Viewport | undefined) => {
  const viewportDep = JSON.stringify(viewport);
  const { setViewport } = useViewport();
  useEffect(() => {
    if (!viewport) {
      return;
    }
    setViewport(viewport);
    // disabling because viewport is stringified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportDep, setViewport]);
};
