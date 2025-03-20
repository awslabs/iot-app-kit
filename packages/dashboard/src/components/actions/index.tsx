import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import {
  colorChartsLineGrid,
  spaceScaledXs,
  spaceScaledXxxl,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import isEqual from 'lodash-es/isEqual';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onSelectWidgetsAction, onToggleReadOnly } from '~/store/actions';
import type { DashboardSave } from '~/types/saving';
import { convertToDashboardConfiguration } from '~/util/convertToDashboardConfiguration';
import { CustomOrangeButton } from '../customOrangeButton';
import { RefreshRateDropDown } from '../refreshRate/refreshRateDropdown';
import { DashboardSettings } from './settings';

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

export interface ActionsProps {
  readOnly: boolean;
  defaultToolbar?: boolean;
  onSave?: DashboardSave;
  editable?: boolean;
}

export const Actions = ({
  editable,
  defaultToolbar = true,
  readOnly,
  onSave,
}: ActionsProps) => {
  const dispatch = useDispatch();
  const mappedDashboardConfiguration = useSelector(
    convertToDashboardConfiguration,
    isEqual
  );

  const [dashboardSettingsVisible, setDashboardSettingsVisible] =
    useState(false);

  const handleOnSave = () => {
    if (!onSave) return;
    onSave(mappedDashboardConfiguration, readOnly ? 'preview' : 'edit');
  };

  const handleOnReadOnly = () => {
    dispatch(onToggleReadOnly());
    dispatch(
      onSelectWidgetsAction({
        widgets: [],
        union: false,
      })
    );
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
              onClick={() => setDashboardSettingsVisible(true)}
              iconName='settings'
              variant='icon'
              data-testid='dashboard-visibility-button'
              ariaLabel='Dashboard settings'
            />
          )}
          <DashboardSettings
            isVisible={dashboardSettingsVisible}
            onClose={() => setDashboardSettingsVisible(false)}
          />
        </SpaceBetween>
      </div>
    </Box>
  );
};
