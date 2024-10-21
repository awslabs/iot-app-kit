import React, { memo, type PropsWithChildren } from 'react';
import { Canvas, CanvasScrollContainer } from '~/features/dashboard-canvas';

export type ViewModeCanvasProps = PropsWithChildren;

export const ViewModeCanvas = memo(function ({
  children,
}: ViewModeCanvasProps) {
  return (
    <CanvasScrollContainer>
      <Canvas showGrid={false} highlighted={false} showGuides={false}>
        {children}
      </Canvas>
    </CanvasScrollContainer>
  );
});