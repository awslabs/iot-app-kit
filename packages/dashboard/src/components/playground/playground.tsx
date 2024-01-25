import React, { ReactNode, useState } from 'react';
import PropertiesPanelIcon from '~/components/resizablePanes/assets/propertiesPane.svg';
import { CollapsiblePanel } from '~/components/internalDashboard/collapsiblePanel';
import {
  CONFIG_PANEL_COLLAPSE_WIDTH,
  CONFIG_PANEL_OPEN_WIDTH,
} from '~/components/playground/constants';
import './playground.css';
import { PropertyDrawer } from '~/components/playground/propertyDrawer/propertyDrawer';

export const Playground = ({
  creator,
  rightPane,
  resourceExplorer,
}: {
  creator: ReactNode;
  rightPane: ReactNode;
  resourceExplorer: ReactNode;
}) => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

  return (
    <div
      className='playground-container' // important
    >
      {/*main area*/}
      <div className='playground-creator-container'>{creator}</div>

      {/*bottom drawer */}
      <PropertyDrawer
        resourceExplorer={resourceExplorer}
        isPanelCollapsed={isPanelCollapsed}
      />

      {/*right config panel*/}
      <div className='playground-config-container'>
        <CollapsiblePanel
          isPanelCollapsed={isPanelCollapsed}
          panelWidth={
            isPanelCollapsed
              ? CONFIG_PANEL_COLLAPSE_WIDTH
              : CONFIG_PANEL_OPEN_WIDTH
          }
          onCollapsedPanelClick={() => {
            setIsPanelCollapsed(!isPanelCollapsed);
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
