import { Box, SpaceBetween } from '@cloudscape-design/components';
import {
  colorChartsLineGrid,
  spaceScaledXs,
  spaceScaledXxxl,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import { SecondaryButton } from '@iot-app-kit/atoms/button/secondary';
import { getPlugin } from '@iot-app-kit/core';
import isEqual from 'lodash-es/isEqual';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onSelectWidgetsAction, onToggleReadOnly } from '../../store/actions';
import { type DashboardSave } from '../../types';
import { convertToDashboardConfiguration } from '../../util/convertToDashbaoardConfiguration';
import { RefreshRateDropDown } from '../refreshRate/refreshRateDropdown';
import DashboardSettings from './settings';

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
          {editable && defaultToolbar && (
            <SecondaryButton onClick={handleOnReadOnly}>Preview</SecondaryButton>
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
