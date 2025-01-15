import isEqual from 'lodash-es/isEqual';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, SpaceBetween } from '@cloudscape-design/components';
import { getPlugin } from '@iot-app-kit/core';

import {
  colorChartsLineGrid,
  spaceScaledXs,
  spaceScaledXxxl,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import { onSelectWidgetsAction, onToggleReadOnly } from '~/store/actions';
import { type DashboardSave } from '~/types';
import CustomOrangeButton from '../customOrangeButton';
import { RefreshRateDropDown } from '../refreshRate/refreshRateDropdown';
import DashboardSettings from './settings';

import { convertToDashboardConfiguration } from '~/util/convertToDashbaoardConfiguration';

export type ActionsProps = {
  readOnly: boolean;
  defaultToolbar?: boolean;
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
  editable,
  defaultToolbar = true,
  readOnly,
  onSave,
}) => {
  const mappedDashboardConfiguration = useSelector(
    convertToDashboardConfiguration,
    isEqual
  );

  const [dashboardSettingsVisible, setDashboardSettingsVisible] =
    useState(false);
  const dispatch = useDispatch();

  const metricsRecorder = getPlugin('metricsRecorder');

  const handleOnSave = () => {
    if (!onSave) return;
    onSave(mappedDashboardConfiguration, readOnly ? 'preview' : 'edit');

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

export default Actions;
