import { DrawerHeader } from '~/components/playground/drawerHeader/drawer-header';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import {
  CONFIG_PANEL_BORDER_WIDTH,
  CONFIG_PANEL_COLLAPSE_WIDTH,
  CONFIG_PANEL_OPEN_WIDTH,
  DRAWER_COLLAPSED_HEIGHT,
  DRAWER_DEFAULT_HEIGHT,
  DRAWER_DRAG_HANDLE_ICON_SIZE,
} from '~/components/playground/constants';
import { ResourceExplorerModal } from '~/components/playground/ResourceExplorerModal/ResourceExplorerModal';
import { PropertiesTable } from '~/components/playground/propertiesTable/propertiesTable';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useWindowSize } from '~/components/playground/hooks/useWindowSize';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import './propertyDrawer.css';

export const PropertyDrawer = ({
  resourceExplorer,
  isPanelCollapsed,
}: {
  resourceExplorer: ReactNode;
  isPanelCollapsed: boolean;
}) => {
  const [showRE, setShowRE] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const selectedWidgets = useSelectedWidgets();
  const prevSelectedWidgets = useRef(selectedWidgets);
  const [innerWidth, innerHeight] = useWindowSize();
  const [drawerSize, setDrawerSize] = useState({
    width: innerWidth,
    height: DRAWER_DEFAULT_HEIGHT,
  });

  // updating width on config panel open/close OR when window is re-sized
  useEffect(() => {
    setDrawerSize({
      width: isPanelCollapsed
        ? innerWidth - CONFIG_PANEL_COLLAPSE_WIDTH - CONFIG_PANEL_BORDER_WIDTH
        : innerWidth - CONFIG_PANEL_OPEN_WIDTH - CONFIG_PANEL_BORDER_WIDTH,
      height: isDrawerCollapsed
        ? DRAWER_COLLAPSED_HEIGHT
        : DRAWER_DEFAULT_HEIGHT,
    });
  }, [innerWidth, isPanelCollapsed, isDrawerCollapsed]);

  // opening the drawer when user selects a widget
  useEffect(() => {
    if (
      prevSelectedWidgets.current.length === 0 &&
      selectedWidgets.length === 1
    ) {
      setIsDrawerCollapsed(false);
    }
    prevSelectedWidgets.current = selectedWidgets;
  }, [selectedWidgets, selectedWidgets.length]);

  // on drawer height change
  const onResize = (_e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    setDrawerSize({ width: size.width, height: size.height });
  };
  return (
    <div
      className='playground-drawer-container'
      style={{
        width: drawerSize.width,
      }}
    >
      {isDrawerCollapsed ? (
        <DrawerHeader
          closed={isDrawerCollapsed}
          setClosed={setIsDrawerCollapsed}
        />
      ) : (
        <Resizable
          className='react-resize-drawer-override'
          height={drawerSize.height}
          onResize={onResize}
          resizeHandles={['n']}
          axis='y'
          handleSize={[
            DRAWER_DRAG_HANDLE_ICON_SIZE,
            DRAWER_DRAG_HANDLE_ICON_SIZE,
          ]}
          maxConstraints={[drawerSize.width, (innerHeight / 5) * 4]} // screen is divided into 20% chunks and limiting the drawer max to 80%
          minConstraints={[drawerSize.width, innerHeight / 5]} // 20% of screen height
        >
          <div
            style={{
              height: drawerSize.height,
            }}
          >
            <DrawerHeader
              closed={isDrawerCollapsed}
              setClosed={setIsDrawerCollapsed}
            />

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
