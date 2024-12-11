import { memo, type ReactNode, type PropsWithChildren } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';

const DEFAULT_PANEL_SIZE = 30;

export interface DashboardFrameProps extends PropsWithChildren {
  openLeftPanel?: boolean;
  openRightPanel: boolean;
  leftPanelContent?: ReactNode;
  rightPanelContent: ReactNode;
}

export const DashboardFrame = memo(
  ({
    openLeftPanel,
    openRightPanel,
    leftPanelContent,
    rightPanelContent,
    children: dashboardCanvas,
  }: DashboardFrameProps) => {
    return (
      <DashboardFrameContent>
        <DashboardCanvasContainer>{dashboardCanvas}</DashboardCanvasContainer>

        <PanelContainer direction='horizontal'>
          {openLeftPanel && (
            <DashboardPanel order={1} defaultSize={DEFAULT_PANEL_SIZE}>
              {leftPanelContent}
            </DashboardPanel>
          )}

          <CustomizationPanelResizeHandle>
            <PanelResizeHandleColorBar />
          </CustomizationPanelResizeHandle>

          <Panel order={2} />

          <CustomizationPanelResizeHandle>
            <PanelResizeHandleColorBar />
          </CustomizationPanelResizeHandle>

          {openRightPanel && (
            <DashboardPanel order={3} defaultSize={DEFAULT_PANEL_SIZE}>
              {rightPanelContent}
            </DashboardPanel>
          )}
        </PanelContainer>
      </DashboardFrameContent>
    );
  }
);

const DashboardFrameContent = styled.main`
  z-index: 0;
  position: relative;
  height: 100%;
`;

const PanelContainer = styled(PanelGroup)`
  // create stacking context for dashboard
  z-index: 0;
  position: relative;
  background: transparent;
`;

const DashboardCanvasContainer = styled.div`
  // create stacking context for dashboard canvas
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex: 0;
`;

const DashboardPanel = styled(Panel)`
  // display above dashboard canvas
  z-index: 1;
  // scroll panel content when collapsed
  overflow: scroll;
  // remove background transparency
  background-color: white;
`;

const CustomizationPanelResizeHandle = styled(PanelResizeHandle)`
  // provide anchor point for color bar
  position: relative;
`;

const PanelResizeHandleColorBar = styled.div`
  // set dimensions based vertical or horizontal orientation
  width: '4px';
  height: 100%;
  // position relative to resize handle
  position: absolute;
  // display higher than customization panel
  z-index: 2;
  // hide until hovering or dragging resize handle
  background-color: transparent;
  ${CustomizationPanelResizeHandle}[data-resize-handle-state='hover'] & {
    background-color: #0972d3;
  }
  ${CustomizationPanelResizeHandle}[data-resize-handle-state='drag'] & {
    background-color: #0972d3;
  }
`;
