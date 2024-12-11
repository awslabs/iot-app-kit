import { memo, type PropsWithChildren, type ReactNode } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';

const DEFAULT_CUSTOMIZATION_PANEL_SIZE = 30;

export interface PanelOrientationProps extends PropsWithChildren {
  openPanel: ReactNode;
  panelAction?: ReactNode;
}

/** Render with customization panel on the right of the dashboard. */
export const RightPanelOrientation = memo(function ({
  openPanel,
  panelAction,
  children,
}: PanelOrientationProps) {
  return (
    <PanelContainer
      // store adjusted panel size for user convenience
      autoSaveId='right-orientation-panel-sizes'
      direction='horizontal'
    >
      <DashboardCanvasContainer>{children}</DashboardCanvasContainer>

      <Panel order={1} />
      {openPanel && (
        <>
          <CustomizationPanelResizeHandle>
            <PanelResizeHandleColorBar orientation='right' />
          </CustomizationPanelResizeHandle>

          <CustomizationPanel
            order={2}
            defaultSize={DEFAULT_CUSTOMIZATION_PANEL_SIZE}
          >
            <CustomizationPanelContent>
              {openPanel}

              <div style={{ position: 'absolute', left: -180, top: 0 }}>
                {panelAction}
              </div>
            </CustomizationPanelContent>
          </CustomizationPanel>
        </>
      )}

      {!openPanel && (
        <div style={{ position: 'absolute', top: 0, right: 180 }}>
          {panelAction}
        </div>
      )}
    </PanelContainer>
  );
});

/** Render with customization panel on the left of the dashboard. */
export const LeftPanelOrientation = memo(function ({
  openPanel,
  panelAction,
  children,
}: PanelOrientationProps) {
  return (
    <PanelContainer
      // store adjusted panel size for user convenience
      autoSaveId='left-orientation-panel-sizes'
      direction='horizontal'
    >
      {openPanel && (
        <>
          <CustomizationPanel
            order={1}
            defaultSize={DEFAULT_CUSTOMIZATION_PANEL_SIZE}
          >
            <CustomizationPanelContent>{openPanel}</CustomizationPanelContent>
          </CustomizationPanel>

          <CustomizationPanelResizeHandle>
            <PanelResizeHandleColorBar orientation='left' />
          </CustomizationPanelResizeHandle>
        </>
      )}
      <Panel order={2} />

      <DashboardCanvasContainer>{children}</DashboardCanvasContainer>

      <div style={{ position: 'absolute', top: 0, right: 180 }}>
        {panelAction}
      </div>
    </PanelContainer>
  );
});

/** Render with customization panel at the bottom of the dashboard. */
export const BottomPanelOrientation = memo(function ({
  openPanel,
  panelAction,
  children,
}: PanelOrientationProps) {
  return (
    <PanelContainer
      // store adjusted panel size for user convenience
      autoSaveId='bottom-orientation-panel-sizes'
      direction='vertical'
    >
      <DashboardCanvasContainer>{children}</DashboardCanvasContainer>

      <Panel order={1} />
      {openPanel && (
        <>
          <CustomizationPanelResizeHandle>
            <PanelResizeHandleColorBar orientation='bottom' />
          </CustomizationPanelResizeHandle>

          <CustomizationPanel
            order={2}
            defaultSize={DEFAULT_CUSTOMIZATION_PANEL_SIZE}
          >
            <CustomizationPanelContent>{openPanel}</CustomizationPanelContent>
          </CustomizationPanel>
        </>
      )}

      <div style={{ position: 'absolute', top: 0, right: 180 }}>
        {panelAction}
      </div>
    </PanelContainer>
  );
});

const PanelContainer = styled(PanelGroup)`
  // create stacking context for dashboard
  z-index: 0;
  position: relative;
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

const CustomizationPanel = styled(Panel)`
  // display above dashboard canvas
  z-index: 1;
  // scroll panel content when collapsed
  overflow: scroll;
  // remove background transparency
  background-color: white;
`;

const CustomizationPanelContent = styled.div`
  position: relative;
  // fill space of parent
  height: 100%;
  // prevent further collapse of content
  min-width: 300px;
  min-height: 300px;
`;

const CustomizationPanelResizeHandle = styled(PanelResizeHandle)`
  // provide anchor point for color bar
  position: relative;
`;

const PanelResizeHandleColorBar = styled.div<{
  orientation: 'right' | 'left' | 'bottom';
}>`
  // set dimensions based vertical or horizontal orientation
  width: ${(props) => (props.orientation === 'bottom' ? '100%' : '4px')};
  height: ${(props) => (props.orientation === 'bottom' ? '4px' : '100%')};
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
