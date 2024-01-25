import React, { ReactNode, useState } from 'react';
import PropertiesPanelIcon from '~/components/resizablePanes/assets/propertiesPane.svg';
import { CollapsiblePanel } from '~/components/internalDashboard/collapsiblePanel';
import {
  CONFIG_PANEL_COLLAPSED_WIDTH_PIXELS,
  CONFIG_PANEL_OPEN_WIDTH_PIXELS,
} from '~/components/dashboardLayout/constants';
import './dashboardLayout.css';
import { PropertyPanel } from '~/components/dashboardLayout/propertyPanel/propertyPanel';

export const DashboardLayout = ({
  centerPane,
  rightPane,
  leftPane,
}: {
  centerPane: ReactNode;
  rightPane: ReactNode;
  leftPane: ReactNode;
}) => {
  const [isConfigPanelCollapsed, setIsConfigPanelCollapsed] = useState(true);

  return (
    <div
      className='dashboard-layout-container' // important
    >
      {/*main area*/}
      <div className='dashboard-layout-center-pane-container'>{centerPane}</div>

      {/*bottom drawer */}
      <PropertyPanel
        resourceExplorer={leftPane}
        isConfigPanelCollapsed={isConfigPanelCollapsed}
      />

      {/*right config panel*/}
      <div className='dashboard-layout-config-container'>
        <CollapsiblePanel
          isPanelCollapsed={isConfigPanelCollapsed}
          panelWidth={
            isConfigPanelCollapsed
              ? CONFIG_PANEL_COLLAPSED_WIDTH_PIXELS
              : CONFIG_PANEL_OPEN_WIDTH_PIXELS
          }
          onCollapsedPanelClick={() => {
            setIsConfigPanelCollapsed(!isConfigPanelCollapsed);
          }}
          panelContent={rightPane}
          icon={PropertiesPanelIcon}
          side='right'
          headerText='Widget Configuration'
        />
      </div>
    </div>
  );
};
