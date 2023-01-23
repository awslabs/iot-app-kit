import React, { FC } from 'react';
import { Container, Header } from '@cloudscape-design/components';
import PropertiesAlarmsSection from './sections/propertiesAlarmSection';
import './index.css';
import { useSelector } from 'react-redux';
import { DashboardState } from '../../store/state';
import { DashboardMessages } from '../../messages';
import { AppKitComponentTags } from '../../types';
import TextSettings from './sections/textSettingSection/text';
import ChartSettings from './sections/chartSettings';
import ThresholdsSection from './sections/thresholdsSection';
import DataSettings from './sections/dataSettings';
import LinkSettings from './sections/textSettingSection/link';

const SidePanel: FC<{ messageOverrides: DashboardMessages }> = ({ messageOverrides }) => {
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  if (selectedWidgets.length !== 1) {
    return <div>Currently we only support changing setting for one widget only.</div>;
  }

  const {
    sidePanel: { propertySection },
  } = messageOverrides;
  const selectedWidget = selectedWidgets[0];
  const isAppKitWidget = AppKitComponentTags.find((tag) => tag === selectedWidget.componentTag);
  const isTextWidget = selectedWidget.componentTag === 'text';

  return (
    <Container header={<Header variant="h3">Configurations</Header>} className={'iot-side-panel'}>
      <ChartSettings />
      {isTextWidget && <TextSettings messageOverride={messageOverrides} />}
      {isTextWidget && <LinkSettings messageOverride={messageOverrides} />}
      {isAppKitWidget && (
        <>
          <PropertiesAlarmsSection messages={propertySection} />
          <ThresholdsSection />
          <DataSettings />
        </>
      )}
    </Container>
  );
};

export default SidePanel;
