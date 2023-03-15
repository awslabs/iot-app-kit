import type { FC } from 'react';
import React from 'react';
import { Box, Header, SpaceBetween } from '@cloudscape-design/components';
import { useSelector } from 'react-redux';
import TextSettings, { isTextWidget } from './sections/textSettingSection/text';
import LinkSettings from './sections/textSettingSection/link';
import { BaseSettings } from './sections/baseSettingSection';
import AxisSetting, { isAxisSettingsSupported } from './sections/axisSettingSection';
import ThresholdsSection, { isThresholdsSupported } from './sections/thresholdsSection/thresholdsSection';
import PropertiesAlarmsSection, { isPropertiesAndAlarmsSupported } from './sections/propertiesAlarmSection';
import type { DashboardState } from '~/store/state';
import type { DashboardMessages } from '~/messages';

import './index.css';

const SidePanel: FC<{ messageOverrides: DashboardMessages }> = ({ messageOverrides }) => {
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  if (selectedWidgets.length !== 1) {
    return (
      <div className='side-panel-empty'>
        <Box margin='m' variant='p' color='text-status-inactive'>
          {messageOverrides.sidePanel.defaultMessage}
        </Box>
      </div>
    );
  }

  const selectedWidget = selectedWidgets[0];

  return (
    <Box padding={{ horizontal: 'm', vertical: 'l' }}>
      <Header variant='h3'>{messageOverrides.sidePanel.header}</Header>
      <SpaceBetween size='xs' direction='vertical'>
        <BaseSettings {...selectedWidget} />
        {isTextWidget(selectedWidget) && (
          <>
            <TextSettings {...selectedWidget} />
            <LinkSettings {...selectedWidget} />
          </>
        )}
        {isPropertiesAndAlarmsSupported(selectedWidget) && <PropertiesAlarmsSection {...selectedWidget} />}
        {isThresholdsSupported(selectedWidget) && <ThresholdsSection {...selectedWidget} />}
        {isAxisSettingsSupported(selectedWidget) && <AxisSetting {...selectedWidget} />}
      </SpaceBetween>
    </Box>
  );
};

export default SidePanel;
