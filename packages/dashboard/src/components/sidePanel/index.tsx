import React from 'react';
import { Header, SpaceBetween } from '@cloudscape-design/components';
import { useSelector } from 'react-redux';
import TextSettings from './sections/textSettingSection/text';
import LinkSettings from './sections/textSettingSection/link';
import InputSettings from './sections/inputSettingsSection';
import { BaseSettings } from './sections/baseSettingSection';
import AxisSetting, { isAxisSettingsSupported } from './sections/axisSettingSection';
import ThresholdsSection, { isThresholdsSupported } from './sections/thresholdsSection/thresholdsSection';
import PropertiesAlarmsSection, { isPropertiesAndAlarmsSupported } from './sections/propertiesAlarmSection';

import type { FC } from 'react';
import type { DashboardState } from '~/store/state';
import type { DashboardMessages } from '~/messages';
import type { AxisWidget } from './sections/axisSettingSection';
import type { ThresholdWidget } from './sections/thresholdsSection/thresholdsSection';
import type { InputWidget, QueryWidget, TextWidget } from '~/customization/widgets/types';

const SidePanel: FC<{ messageOverrides: DashboardMessages }> = ({ messageOverrides }) => {
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  if (selectedWidgets.length !== 1) {
    return <div className='iot-side-panel'>{messageOverrides.sidePanel.defaultMessage}</div>;
  }

  const selectedWidget = selectedWidgets[0];
  const isTextWidget = selectedWidget.type === 'text';
  const isInputWidget = selectedWidget.type === 'input';

  return (
    <div className='iot-side-panel'>
      <Header variant='h3'>{messageOverrides.sidePanel.header}</Header>
      <SpaceBetween size='xs' direction='vertical'>
        <BaseSettings {...selectedWidget} />
        {isTextWidget && (
          <>
            <TextSettings {...(selectedWidget as TextWidget)} />
            <LinkSettings {...(selectedWidget as TextWidget)} />
          </>
        )}
        {isInputWidget && <InputSettings {...(selectedWidget as InputWidget)} />}
        {isPropertiesAndAlarmsSupported(selectedWidget) && (
          <PropertiesAlarmsSection {...(selectedWidget as QueryWidget)} />
        )}
        {isThresholdsSupported(selectedWidget) && <ThresholdsSection {...(selectedWidget as ThresholdWidget)} />}
        {isAxisSettingsSupported(selectedWidget) && <AxisSetting {...(selectedWidget as AxisWidget)} />}
      </SpaceBetween>
    </div>
  );
};

export default SidePanel;
