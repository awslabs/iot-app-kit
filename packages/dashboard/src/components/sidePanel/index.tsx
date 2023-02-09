import React, { FC } from 'react';
import { Header, SpaceBetween } from '@cloudscape-design/components';
import { useSelector } from 'react-redux';
import { DashboardState } from '../../store/state';
import { useMessage } from '../../messages';
import { AppKitComponentTags } from '../../types';
import TextSettings from './sections/textSettingSection/text';
import LinkSettings from './sections/textSettingSection/link';
import { BaseSettings } from './sections/baseSettingSection';
import AxisSetting from './sections/axisSettingSection';
import ThresholdsSection from './sections/thresholdsSection/thresholdsSection';
import PropertiesAlarmsSection from './sections/propertiesAlarmSection';
import './index.scss';

const SidePanel: FC = () => {
  const { defaultMessage, header } = useMessage((message) => message.sidePanel);
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  if (selectedWidgets.length !== 1) {
    return <div className="iot-side-panel">{defaultMessage}</div>;
  }

  const selectedWidget = selectedWidgets[0];
  const isAppKitWidget = AppKitComponentTags.find((tag) => tag === selectedWidget.componentTag);
  const isTextWidget = selectedWidget.componentTag === 'text';
  return (
    <div className="iot-side-panel">
      <Header variant="h3">{header}</Header>
      <SpaceBetween size={'xs'} direction={'vertical'}>
        <BaseSettings />
        {isTextWidget && <TextSettings />}
        {isTextWidget && <LinkSettings />}
        {isAppKitWidget && (
          <>
            <PropertiesAlarmsSection />
            <ThresholdsSection />
            <AxisSetting />
          </>
        )}
      </SpaceBetween>
    </div>
  );
};

export default SidePanel;
