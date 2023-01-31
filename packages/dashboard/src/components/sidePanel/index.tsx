import React, { FC } from 'react';
import { Header, SpaceBetween } from '@cloudscape-design/components';
import { useSelector } from 'react-redux';
import { DashboardState } from '../../store/state';
import { DashboardMessages } from '../../messages';
import { AppKitComponentTags } from '../../types';
import TextSettings from './sections/textSettingSection/text';
import DataSettings from './sections/dataSettings';
import LinkSettings from './sections/textSettingSection/link';
import { BaseSettings } from './sections/baseSettingSection';
import AxisSetting from './sections/axisSettingSection';
import './index.scss';

const SidePanel: FC<{ messageOverrides: DashboardMessages }> = ({ messageOverrides }) => {
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  if (selectedWidgets.length !== 1) {
    return <div className="iot-side-panel">{messageOverrides.sidePanel.defaultMessage}</div>;
  }

  const selectedWidget = selectedWidgets[0];
  const isAppKitWidget = AppKitComponentTags.find((tag) => tag === selectedWidget.componentTag);
  const isTextWidget = selectedWidget.componentTag === 'text';

  return (
    <div className="iot-side-panel">
      <Header variant="h3">{messageOverrides.sidePanel.header}</Header>
      <SpaceBetween size={'xs'} direction={'vertical'}>
        <BaseSettings messageOverrides={messageOverrides} />
        {isTextWidget && <TextSettings messageOverride={messageOverrides} />}
        {isTextWidget && <LinkSettings messageOverride={messageOverrides} />}
        {isAppKitWidget && (
          <>
            {/* WIP <PropertiesAlarmsSection messageOverrides={messageOverrides} />*/}
            {/* WIP <ThresholdsSection messageOverrides={messageOverrides} />*/}
            <AxisSetting messageOverrides={messageOverrides} />
            <DataSettings />
          </>
        )}
      </SpaceBetween>
    </div>
  );
};

export default SidePanel;
