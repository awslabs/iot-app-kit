import React from 'react';
import { Container } from '@cloudscape-design/components';
import PropertiesAlarmsSection from './sub-components/properties-alarms-section';
import ThresholdsSection from './sub-components/thresholds-section';
import ChartSettings from './sub-components/chart-settings';
import DataSettings from './sub-components/data-settings';
import './index.css';

const IoTSidePanel = () => {
  return (
    <Container header={<h2>Configurations</h2>} className={'iot-side-panel'}>
      <PropertiesAlarmsSection />
      <ThresholdsSection />
      <ChartSettings />
      <DataSettings />
    </Container>
  );
};

export default IoTSidePanel;
