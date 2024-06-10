import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, pick } from 'lodash';

import { getPlugin } from '@iot-app-kit/core';
import { useViewport } from '@iot-app-kit/react-components';
import { Button, SpaceBetween, Box } from '@cloudscape-design/components';

import { onSelectWidgetsAction, onToggleReadOnly } from '~/store/actions';
import type { DashboardState } from '~/store/state';
import { DashboardSave } from '~/types';
import DashboardSettings from './settings';
import CustomOrangeButton from '../customOrangeButton';
import { parseViewport } from '~/util/parseViewport';
import { RefreshRateDropDown } from '../refreshRate/refreshRateDropdown';
import {
  colorChartsLineGrid,
  spaceScaledXs,
  spaceScaledXxxl,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';

const DEFAULT_VIEWPORT = { duration: '10m' };

export type ActionsProps = {
  grid: DashboardState['grid'];
  readOnly: boolean;
  defaultToolbar?: boolean;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  onSave?: DashboardSave;
  editable?: boolean;
};

const Divider = () => (
  <div
    style={{
      width: spaceScaledXxxs,
      height: spaceScaledXxxl,
      margin: `0 ${spaceScaledXs}`,
      background: colorChartsLineGrid,
    }}
  />
);

const Actions: React.FC<ActionsProps> = ({
  dashboardConfiguration,
  editable,
  defaultToolbar = true,
  grid,
  readOnly,
  onSave,
}) => {
  const significantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );
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
        defaultViewport: parseViewport(dashboardConfiguration.defaultViewport),
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
      <div
        aria-label='dashboard actions'
        //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <SpaceBetween size='s' direction='horizontal' alignItems='end'>
          <RefreshRateDropDown />
          {editable && <Divider />}
          {onSave && editable && defaultToolbar && (
            <Button onClick={handleOnSave}>Save</Button>
          )}
          {editable && defaultToolbar && (
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
              data-testid='dashboard-visibility-button'
              ariaLabel='Dashboard settings'
            />
          )}
          <DashboardSettings
            isVisible={dashboardSettingsVisible}
            onClose={() => setSettingVisibility(false)}
          />
        </SpaceBetween>
      </div>
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
