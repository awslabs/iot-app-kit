import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@cloudscape-design/components';
import { onToggleReadOnly } from '~/store/actions';
import type { DashboardMessages } from '~/messages';
import type { DashboardState, SaveableDashboard } from '~/store/state';

export type ActionsProps = {
  messageOverrides: DashboardMessages;
  grid: DashboardState['grid'];
  readOnly: boolean;
  hasEditPermission: boolean;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  onSave?: (dashboard: SaveableDashboard) => void;
};

const Actions: React.FC<ActionsProps> = ({
  grid,
  dashboardConfiguration,
  messageOverrides,
  hasEditPermission,
  readOnly,
  onSave,
}) => {
  const dispatch = useDispatch();

  const handleOnSave = () => {
    if (!onSave) return;
    const { height, width, cellSize, stretchToFit } = grid;
    onSave({
      grid: { height, width, cellSize, stretchToFit },
      dashboardConfiguration,
    });
  };

  const handleOnReadOnly = () => {
    dispatch(onToggleReadOnly());
  };

  if (!onSave && !hasEditPermission) return <></>;

  return (
    <div className='actions iot-dashboard-toolbar-actions'>
      <h1 className='iot-dashboard-toolbar-title'>{messageOverrides.toolbar.actions.title}</h1>
      <div className='button-actions'>
        {onSave && (
          <Button variant='primary' onClick={handleOnSave} data-test-id='actions-save-dashboard-btn'>
            {messageOverrides.toolbar.actions.save}
          </Button>
        )}
        {hasEditPermission && (
          <Button variant='primary' onClick={handleOnReadOnly} data-test-id='actions-toggle-read-only-btn'>
            {readOnly ? 'Edit' : 'Preview'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Actions;
