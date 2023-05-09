import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, SpaceBetween, Box } from '@cloudscape-design/components';
import { onToggleReadOnly } from '~/store/actions';
import type { DashboardState } from '~/store/state';
import { isEqual, pick } from 'lodash';
import { DashboardSave } from '~/types';
import DashboardSettings from './settings';

export type ActionsProps = {
  grid: DashboardState['grid'];
  readOnly: boolean;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  onSave?: DashboardSave;
  editable?: boolean;
};

const Actions: React.FC<ActionsProps> = ({ dashboardConfiguration, editable, grid, readOnly, onSave }) => {
  const [dashboardSettingsVisible, setDashboardSettingsVisible] = useState(false);
  const dispatch = useDispatch();

  const handleOnSave = () => {
    if (!onSave) return;
    onSave({
      displaySettings: {
        numColumns: grid.width,
        numRows: grid.height,
        cellSize: grid.stretchToFit ? undefined : grid.cellSize,
      },
      ...dashboardConfiguration,
    });
  };

  const handleOnReadOnly = () => {
    dispatch(onToggleReadOnly());
  };

  const handleOnClose = () => {
    setDashboardSettingsVisible(false);
  };

  return (
    <>
      <Box variant='awsui-key-label'>Actions</Box>
      <SpaceBetween size='s' direction='horizontal'>
        {onSave && <Button onClick={handleOnSave}>Save</Button>}
        {editable && <Button onClick={handleOnReadOnly}>{readOnly ? 'Edit' : 'Preview'}</Button>}
        {editable && !readOnly && (
          <Button onClick={() => setDashboardSettingsVisible(true)} iconName='settings' variant='icon' />
        )}
        <DashboardSettings isVisible={dashboardSettingsVisible} onClose={handleOnClose} />
      </SpaceBetween>
    </>
  );
};

const gridAsComparable = (grid: DashboardState['grid']) => pick(grid, ['height', 'width', 'cellSize', 'stretchToFit']);
const actionsComparator = (a: Readonly<ActionsProps>, b: Readonly<ActionsProps>): boolean => {
  const gridIsSame = isEqual(gridAsComparable(a.grid), gridAsComparable(b.grid));
  const dashboardConfigurationIsSame = isEqual(a.dashboardConfiguration, b.dashboardConfiguration);
  return gridIsSame && dashboardConfigurationIsSame;
};

export default memo(Actions, actionsComparator);
