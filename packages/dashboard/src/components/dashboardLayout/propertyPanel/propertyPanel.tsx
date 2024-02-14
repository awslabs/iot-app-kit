import { PropertyPanelHeader } from '~/components/dashboardLayout/propertyPanel/propertyPanelHeader/propertyPanelHeader';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import {
  CONFIG_PANEL_COLLAPSED_WIDTH_PIXELS,
  CONFIG_PANEL_OPEN_WIDTH_PIXELS,
  PROPERTY_PANEL_DEFAULT_HEIGHT_PIXELS,
  PROPERTY_PANEL_DRAG_HANDLE_ICON_SIZE,
  PROPERTY_PANEL_OPEN_DEFAULT_HEIGHT_PIXELS,
} from '~/components/dashboardLayout/constants';
import React, { ReactNode, useEffect, useState } from 'react';
import { useWindowSize } from '~/components/dashboardLayout/hooks/useWindowSize';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import './propertyPanel.css';
import { PropertiesPanelTable } from '~/components/dashboardLayout/propertyPanel/propertiesPanelTable/propertiesPanelTable';

export const PropertyPanel = ({
  isConfigPanelCollapsed,
}: {
  resourceExplorer: ReactNode;
  isConfigPanelCollapsed: boolean;
}) => {
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
          minConstraints={[
            panelWidth,
            PROPERTY_PANEL_OPEN_DEFAULT_HEIGHT_PIXELS,
          ]}
        >
          <div
            style={{
              height: panelHeight,
            }}
          >
            {panelHeader}
            <PropertiesPanelTable onAddDataStreams={() => {}} />
          </div>
        </Resizable>
      )}
    </div>
  );
};
