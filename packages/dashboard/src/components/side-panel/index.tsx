import React from 'react';
import { Container, Header } from '@cloudscape-design/components';
import PropertiesAlarmsSection from './sub-components/properties-alarms-section';
import ThresholdsSection from './sub-components/thresholds-section';
import ChartSettings from './sub-components/chart-settings';
import DataSettings from './sub-components/data-settings';
import './index.css';

const IoTSidePanel = () => {
  return (
    <Container header={<Header variant="h3">Configurations</Header>} className={'iot-side-panel'}>
      <PropertiesAlarmsSection />
      <ThresholdsSection />
      <ChartSettings />
      <DataSettings />
    </Container>
  );
};

export default IoTSidePanel;
