import { viewportManager, type Viewport } from '@iot-app-kit/core';
import { ViewportContext } from '@iot-app-kit/component-core';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { v4 as uuid } from 'uuid';

export interface TimeSyncProps {
  group?: string;
  initialViewport?: Viewport;
  children: ReactNode;
  onViewportChange?: (viewport: Viewport) => void;
}

export const DEFAULT_VIEWPORT: Viewport = {
  duration: '10m', // default viewport
};

export const TimeSync: React.FC<TimeSyncProps> = ({
  group,
  initialViewport,
  onViewportChange,
  children,
}) => {
  const [viewport, setViewport] = useState<Viewport>(
    initialViewport || DEFAULT_VIEWPORT
  );
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string>();

  // Fall back unique viewport group, only used if `group` is not defined.
  const autoGeneratedGroup = useRef(uuid());

  const updateViewportGroup = useCallback(
    (v: Viewport, lastUpdatedBy?: string) => {
      viewportManager.update(
        group ?? autoGeneratedGroup.current,
        v,
        lastUpdatedBy
      );
      setLastUpdatedBy(lastUpdatedBy);
      onViewportChange && onViewportChange(v);
    },
    [group, onViewportChange]
  );

  useEffect(() => {
    const { viewport, unsubscribe } = viewportManager.subscribe(
      group ?? autoGeneratedGroup.current,
      (v) => setViewport(v as Viewport)
    );

    // Set initial viewport
    if (viewport) {
      setViewport(viewport as Viewport);
    } else {
      updateViewportGroup(initialViewport || DEFAULT_VIEWPORT);
    }
    return unsubscribe;
  }, [group, initialViewport, updateViewportGroup]);

  return (
    <ViewportContext.Provider
      value={{
        setViewport: updateViewportGroup,
        viewport,
        group: group ?? autoGeneratedGroup.current,
        lastUpdatedBy,
        onViewportChange,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};
