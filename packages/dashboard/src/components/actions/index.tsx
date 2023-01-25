import React from 'react';

import { Button } from '@cloudscape-design/components';

import { DashboardMessages } from '../../messages';
import { DashboardState, SaveableDashboard } from '../../store/state';

export type ActionsProps = {
  onSave: (dashboard: SaveableDashboard) => void;
  messageOverrides: DashboardMessages;
  grid: DashboardState['grid'];
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  assetsDescriptionMap: DashboardState['assetsDescriptionMap'];
};

const Actions: React.FC<ActionsProps> = ({
  onSave,
  grid,
  dashboardConfiguration,
  messageOverrides,
  assetsDescriptionMap,
}) => {
  const handleOnSave = () => {
    const { height, width, cellSize, stretchToFit } = grid;
    onSave({
      grid: { height, width, cellSize, stretchToFit },
      dashboardConfiguration,
      assetsDescriptionMap,
    });
  };

  return (
    <div className="actions">
      <h1 className="iot-dashboard-toolbar-title">{messageOverrides.toolbar.actions.title}</h1>
      <Button variant="primary" onClick={handleOnSave}>
        {messageOverrides.toolbar.actions.save}
      </Button>
    </div>
  );
};

export default Actions;
