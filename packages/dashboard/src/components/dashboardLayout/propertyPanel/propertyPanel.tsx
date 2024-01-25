import { PropertyPanelHeader } from '~/components/dashboardLayout/propertyPanel/propertyPanelHeader/propertyPanelHeader';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import {
  CONFIG_PANEL_COLLAPSED_WIDTH_PIXELS,
  CONFIG_PANEL_OPEN_WIDTH_PIXELS,
  PROPERTY_PANEL_DEFAULT_HEIGHT_PIXELS,
  PROPERTY_PANEL_DRAG_HANDLE_ICON_SIZE,
} from '~/components/dashboardLayout/constants';
import { ResourceExplorerModal } from '~/components/dashboardLayout/ResourceExplorerModal/ResourceExplorerModal';
import { PropertiesTable } from '~/components/dashboardLayout/propertiesTable/propertiesTable';
import React, { ReactNode, useEffect, useState } from 'react';
import { useWindowSize } from '~/components/dashboardLayout/hooks/useWindowSize';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import './propertyPanel.css';

export const PropertyPanel = ({
  resourceExplorer,
  isConfigPanelCollapsed,
}: {
  resourceExplorer: ReactNode;
  isConfigPanelCollapsed: boolean;
}) => {
  const [showRE, setShowRE] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true);
  const selectedWidgets = useSelectedWidgets();
  const [innerWidth] = useWindowSize();
  const [panelHeight, setPanelHeight] = useState(
    PROPERTY_PANEL_DEFAULT_HEIGHT_PIXELS
  );
  const panelWidth =
    innerWidth -
    (isConfigPanelCollapsed
      ? CONFIG_PANEL_COLLAPSED_WIDTH_PIXELS
      : CONFIG_PANEL_OPEN_WIDTH_PIXELS);

  // opening the drawer when user selects a widget
  useEffect(() => {
    if (isDrawerCollapsed && selectedWidgets.length) {
      setIsDrawerCollapsed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWidgets.length]);

  // on drawer height change
  const onResize = (_e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    setPanelHeight(size.height);
  };

  const panelHeader = (
    <PropertyPanelHeader
      closed={isDrawerCollapsed}
      setClosed={setIsDrawerCollapsed}
    />
  );
  return (
    <div
      className='property-panel-container'
      style={{
        width: panelWidth,
      }}
    >
      {isDrawerCollapsed ? (
        panelHeader
      ) : (
        <Resizable
          className='react-resize-drawer-override'
          height={panelHeight}
          onResize={onResize}
          resizeHandles={['n']}
          axis='y'
          handleSize={[
            PROPERTY_PANEL_DRAG_HANDLE_ICON_SIZE,
            PROPERTY_PANEL_DRAG_HANDLE_ICON_SIZE,
          ]}
          minConstraints={[panelWidth, 159]}
        >
          <div
            style={{
              height: panelHeight,
            }}
          >
            {panelHeader}
            <ResourceExplorerModal
              visible={showRE}
              resourceExplorer={resourceExplorer}
              onDismiss={() => setShowRE(false)}
            />
            <PropertiesTable onAddDataStreams={() => setShowRE(true)} />
          </div>
        </Resizable>
      )}
    </div>
  );
};
