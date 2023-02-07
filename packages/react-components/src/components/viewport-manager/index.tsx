import React, { createContext, useCallback, useEffect, useState } from 'react';
import { viewportManager, Viewport } from '@iot-app-kit/core';

export interface IViewportContext {
  viewport?: Viewport;
  reset(): void;
  update(viewport: Viewport): void;
}

export const ViewportContext = createContext<IViewportContext>({
  reset: () => {},
  update: () => {},
});

export interface ViewportManagerProps {
  group: string;
  initialViewport?: Viewport;
}

const DEFAULT_VIEWPORT: Viewport = {
  duration: '6h', // default viewport
};

export const ViewportManager: React.FC<ViewportManagerProps> = ({ group, initialViewport, children }) => {
  const [viewport, setViewport] = useState<Viewport>(initialViewport || DEFAULT_VIEWPORT);

  const update = useCallback(
    (v: Viewport) => {
      viewportManager.update(group, v);
    },
    [group]
  );

  useEffect(() => {
    const { viewport, unsubscribe } = viewportManager.subscribe(group, (v) => setViewport(v as Viewport));

    if (viewport) {
      setViewport(viewport as Viewport);
    } else {
      update(initialViewport || DEFAULT_VIEWPORT);
    }
    return unsubscribe;
  }, [group]);

  const reset = useCallback(() => {
    viewportManager.reset();
  }, []);

  return (
    <ViewportContext.Provider
      value={{
        reset,
        update,
        viewport,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};
