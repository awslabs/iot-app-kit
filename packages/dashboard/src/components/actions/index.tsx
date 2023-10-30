import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEqual, pick } from 'lodash';

import { useViewport } from '@iot-app-kit/react-components';
import { Button, SpaceBetween, Box } from '@cloudscape-design/components';

import { onToggleReadOnly } from '~/store/actions';
import type { DashboardState } from '~/store/state';
import { DashboardSave } from '~/types';
import DashboardSettings from './settings';
import CustomOrangeButton from '../customOrangeButton';

const DEFAULT_VIEWPORT = { duration: '10m' };

export type ActionsProps = {
  grid: DashboardState['grid'];
  readOnly: boolean;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  significantDigits: DashboardState['significantDigits'];
  onSave?: DashboardSave;
  editable?: boolean;
};

const Actions: React.FC<ActionsProps> = ({
  dashboardConfiguration,
  significantDigits,
  editable,
  grid,
  readOnly,
  onSave,
}) => {
  const [dashboardSettingsVisible, setDashboardSettingsVisible] = useState(false);
  const dispatch = useDispatch();

  const { viewport } = useViewport();

  const handleOnSave = () => {
    if (!onSave) return;
    onSave({
      displaySettings: {
        numColumns: grid.width,
        numRows: grid.height,
        cellSize: grid.stretchToFit ? undefined : grid.cellSize,
        significantDigits,
      },
      ...dashboardConfiguration,
      viewport: viewport ?? DEFAULT_VIEWPORT,
    });
  };

  const handleOnReadOnly = () => {
    dispatch(onToggleReadOnly());
  };

  const handleOnClose = () => {
    setDashboardSettingsVisible(false);
  };

  return (
    <Box padding={{ top: 'xxs' }} data-testid='dashboard-actions'>
      <SpaceBetween size='s' direction='horizontal'>
        {onSave && <Button onClick={handleOnSave}>Save</Button>}
        {editable && <CustomOrangeButton title={readOnly ? 'Edit' : 'Preview'} handleClick={handleOnReadOnly} />}
        {editable && !readOnly && (
          <Button onClick={() => setDashboardSettingsVisible(true)} iconName='settings' variant='icon' />
        )}
        <DashboardSettings isVisible={dashboardSettingsVisible} onClose={handleOnClose} />
      </SpaceBetween>
    </Box>
  );
};

const gridAsComparable = (grid: DashboardState['grid']) => pick(grid, ['height', 'width', 'cellSize', 'stretchToFit']);
const actionsComparator = (a: Readonly<ActionsProps>, b: Readonly<ActionsProps>): boolean => {
  const gridIsSame = isEqual(gridAsComparable(a.grid), gridAsComparable(b.grid));
  const dashboardConfigurationIsSame = isEqual(a.dashboardConfiguration, b.dashboardConfiguration);
  return gridIsSame && dashboardConfigurationIsSame;
};

export default memo(Actions, actionsComparator);
