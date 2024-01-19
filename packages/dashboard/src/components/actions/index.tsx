import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isEqual, pick } from 'lodash';

import { getPlugin } from '@iot-app-kit/core';
import { useViewport } from '@iot-app-kit/react-components';
import { Button, SpaceBetween, Box } from '@cloudscape-design/components';

import { onSelectWidgetsAction, onToggleReadOnly } from '~/store/actions';
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
  const [dashboardSettingsVisible, setDashboardSettingsVisible] =
    useState(false);
  const dispatch = useDispatch();

  const { viewport } = useViewport();

  const metricsRecorder = getPlugin('metricsRecorder');

  const handleOnSave = () => {
    if (!onSave) return;
    onSave(
      {
        displaySettings: {
          numColumns: grid.width,
          numRows: grid.height,
          cellSize: grid.cellSize,
          significantDigits,
        },
        ...dashboardConfiguration,
        viewport: viewport ?? DEFAULT_VIEWPORT,
      },
      readOnly ? 'preview' : 'edit'
    );

    metricsRecorder?.record({
      metricName: 'DashboardSave',
      metricValue: 1,
    });
  };

  const handleOnReadOnly = () => {
    dispatch(onToggleReadOnly());
    dispatch(
      onSelectWidgetsAction({
        widgets: [],
        union: false,
      })
    );

    metricsRecorder?.record({
      // When it is readOnly, it is toggled to Edit; Preview otherwise
      metricName: readOnly ? 'DashboardEdit' : 'DashboardPreview',
      metricValue: 1,
    });
  };

  const setSettingVisibility = (visibility: boolean) => {
    setDashboardSettingsVisible(visibility);

    metricsRecorder?.record({
      metricName: visibility ? 'DashboardSettingOpen' : 'DashboardSettingClose',
      metricValue: 1,
    });
  };

  return (
    <Box padding={{ top: 'xxs' }} data-testid='dashboard-actions'>
      <SpaceBetween size='s' direction='horizontal'>
        {onSave && <Button onClick={handleOnSave}>Save</Button>}
        {editable && (
          <CustomOrangeButton
            title={readOnly ? 'Edit' : 'Preview'}
            handleClick={handleOnReadOnly}
          />
        )}
        {editable && !readOnly && (
          <Button
            onClick={() => setSettingVisibility(true)}
            iconName='settings'
            variant='icon'
            ariaLabel='Dashboard settings'
          />
        )}
        <DashboardSettings
          isVisible={dashboardSettingsVisible}
          onClose={() => setSettingVisibility(false)}
        />
      </SpaceBetween>
    </Box>
  );
};

const gridAsComparable = (grid: DashboardState['grid']) =>
  pick(grid, ['height', 'width', 'cellSize']);
const actionsComparator = (
  a: Readonly<ActionsProps>,
  b: Readonly<ActionsProps>
): boolean => {
  const readOnlyIsSame = a.readOnly === b.readOnly;
  const gridIsSame = isEqual(
    gridAsComparable(a.grid),
    gridAsComparable(b.grid)
  );
  const dashboardConfigurationIsSame = isEqual(
    a.dashboardConfiguration,
    b.dashboardConfiguration
  );
  return gridIsSame && dashboardConfigurationIsSame && readOnlyIsSame;
};

export default memo(Actions, actionsComparator);
