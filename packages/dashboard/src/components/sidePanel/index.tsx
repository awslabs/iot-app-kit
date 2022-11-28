import React from 'react';
import { Container, Header } from '@cloudscape-design/components';
import PropertiesAlarmsSection from './sections/propertiesAlarmsSection';
import ThresholdsSection from './sections/thresholdsSection';
import ChartSettings from './sections/chartSettings';
import DataSettings from './sections/dataSettings';
import './index.css';

const SidePanel = () => {
  return (
    <Container header={<Header variant="h3">Configurations</Header>} className={'iot-side-panel'}>
      <PropertiesAlarmsSection />
      <ThresholdsSection />
      <ChartSettings />
      <DataSettings />
    </Container>
  );
};

export default SidePanel;
