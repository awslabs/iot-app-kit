import React, { forwardRef } from 'react';
import { Viewport } from '@iot-app-kit/core';
import { useViewport } from '../viewport-manager';

export interface IViewportProps {
  viewport: Viewport;
}

function makeViewportAware<ElementType, PropType extends IViewportProps>(BaseComponent: any) {
  const cp = forwardRef<ElementType, Omit<PropType, 'viewport'>>((props, ref) => {
    const { viewport: sharedViewport } = useViewport(); // if inside a <ViewportManager /> tag, we want to use the shared viewport, otherwise we fallback to the original behavior where you ned a custom viewport for each element.

    return <BaseComponent ref={ref} {...props} viewport={sharedViewport} />;
  });

  cp.displayName = `viewportAware(${BaseComponent.displayName})`;

  return cp;
}

export default makeViewportAware;
