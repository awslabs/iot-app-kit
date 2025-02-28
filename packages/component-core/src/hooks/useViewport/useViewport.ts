import { createContext, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { type Viewport } from '@iot-app-kit/core';

export interface IViewportContext {
  viewport?: Viewport;
  setViewport(viewport: Viewport, lastUpdatedBy?: string): void;
  group: string;
  lastUpdatedBy?: string;
  onViewportChange?: (viewport: Viewport) => void;
}

export const ViewportContext = createContext<IViewportContext>({
  setViewport: () => {},
  group: uuid(),
});

export const useViewport = () => useContext(ViewportContext);
