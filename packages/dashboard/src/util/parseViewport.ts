import type { Viewport } from '@iot-app-kit/core';

export const parseViewport = (viewport?: string): Viewport | undefined => {
  return viewport ? JSON.parse(viewport) : undefined;
};
