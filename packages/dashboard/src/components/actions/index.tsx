import React, { memo } from 'react';
import { useDispatch } from 'react-redux';

import { Button, SpaceBetween, FormField } from '@cloudscape-design/components';
import { onToggleReadOnly } from '~/store/actions';
import type { DashboardMessages } from '~/messages';
import type { DashboardState, SaveableDashboard } from '~/store/state';
import { isEqual, pick } from 'lodash';

export type ActionsProps = {
  messageOverrides: DashboardMessages;
  grid: DashboardState['grid'];
  readOnly: boolean;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  onSave?: (dashboard: SaveableDashboard) => void;
};

const Actions: React.FC<ActionsProps> = ({ grid, dashboardConfiguration, messageOverrides, readOnly, onSave }) => {
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

  return (
    <FormField label={messageOverrides.toolbar.actions.title}>
      <SpaceBetween size='s' direction='horizontal'>
        {onSave && (
          <Button onClick={handleOnSave} data-test-id='actions-save-dashboard-btn'>
            {messageOverrides.toolbar.actions.save}
          </Button>
        )}
        <Button onClick={handleOnReadOnly} data-test-id='actions-toggle-read-only-btn'>
          {readOnly ? 'Edit' : 'Preview'}
        </Button>
      </SpaceBetween>
    </FormField>
  );
};

const gridAsComparable = (grid: DashboardState['grid']) => pick(grid, ['height', 'width', 'cellSize', 'stretchToFit']);
const actionsComparator = (a: Readonly<ActionsProps>, b: Readonly<ActionsProps>): boolean => {
  const gridIsSame = isEqual(gridAsComparable(a.grid), gridAsComparable(b.grid));
  const dashboardConfigurationIsSame = isEqual(a.dashboardConfiguration, b.dashboardConfiguration);
  return gridIsSame && dashboardConfigurationIsSame;
};

export default memo(Actions, actionsComparator);
