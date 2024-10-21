import React, { memo, type PropsWithChildren, type ReactNode } from 'react';
import styled from 'styled-components';
import { useOrientation } from '~/features/dashboard-panels/use-orientation';
import {
  BottomPanelOrientation,
  LeftPanelOrientation,
  RightPanelOrientation,
} from '../dashboard-panels/panel-orientations';

export interface CanvasFrameProps extends PropsWithChildren {
  panelControlBar: ReactNode;
  openPanel: ReactNode;
}

/** Render the lower portion of the dashboard. */
export const CanvasFrame = memo(function ({
  panelControlBar,
  openPanel,
  children,
}: CanvasFrameProps) {
  const [orientation] = useOrientation();

  switch (orientation) {
    case 'right':
      return (
        <CanvasFrameContainer>
          <RightPanelOrientation openPanel={openPanel}>
            {children}
          </RightPanelOrientation>
          {panelControlBar}
        </CanvasFrameContainer>
      );
    case 'left':
      return (
        <CanvasFrameContainer>
          <LeftPanelOrientation openPanel={openPanel}>
            {children}
          </LeftPanelOrientation>
          {panelControlBar}
        </CanvasFrameContainer>
      );
    case 'bottom':
      return (
        <CanvasFrameContainer>
          <BottomPanelOrientation openPanel={openPanel}>
            {children}
          </BottomPanelOrientation>
          {panelControlBar}
        </CanvasFrameContainer>
      );
  }
});

const CanvasFrameContainer = styled.div`
  // fill space of parent
  display: flex;
  height: 100%;
  width: 100%;
  // create anchor point dashboard canvas content
  position: relative;

  overflow: hidden;
`;
