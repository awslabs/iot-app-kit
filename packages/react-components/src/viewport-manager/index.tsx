import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { viewportManager, Viewport } from '@iot-app-kit/core';
import { WebglContext } from '..';

export interface IViewportContext {
  viewport?: Viewport;
  reset(): void;
  update(viewport: Viewport): void;
}

const ViewportContext = createContext<IViewportContext>({
  reset: () => {},
  update: () => {},
});

export const useViewport = () => {
  return useContext(ViewportContext);
};

export interface ViewportManagerProps {
  group: string;
}

const ViewportManager: React.FC<ViewportManagerProps> = ({ group, children }) => {
  const [viewport, setViewport] = useState<Viewport>({
    duration: '6h', // default viewport
  });

  useEffect(() => {
    const { viewport, unsubscribe } = viewportManager.subscribe(group, (v) => setViewport(v as Viewport));

    if (viewport) {
      setViewport(viewport as Viewport);
    }
    return unsubscribe;
  }, [group]);

  const reset = useCallback(() => {
    viewportManager.reset();
  }, []);

  const update = useCallback(
    (v: Viewport) => {
      viewportManager.update(group, v);
    },
    [group]
  );

  return (
    <ViewportContext.Provider
      value={{
        reset,
        update,
        viewport,
      }}
    >
      <WebglContext>{children}</WebglContext>
    </ViewportContext.Provider>
  );
};

export default ViewportManager;
