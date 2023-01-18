import React, { FC } from 'react';
import { Container, Header } from '@cloudscape-design/components';
import PropertiesAlarmsSection from './sections/propertiesAlarmSection';
import ThresholdsSection from './sections/thresholdsSection';
import ChartSettings from './sections/chartSettings';
import DataSettings from './sections/dataSettings';
import './index.css';
import { useSelector } from 'react-redux';
import { DashboardState } from '../../store/state';
import { DashboardMessages } from '../../messages';

const SidePanel: FC<{ messageOverrides: DashboardMessages }> = ({
  messageOverrides: {
    sidePanel: { propertySection },
  },
}) => {
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  if (selectedWidgets.length !== 1) {
    return <div>Currently we only support changing setting for one widget only.</div>;
  }
  return (
    <Container header={<Header variant="h3">Configurations</Header>} className={'iot-side-panel'}>
      <PropertiesAlarmsSection messages={propertySection} />
      <ThresholdsSection />
      <ChartSettings />
      <DataSettings />
    </Container>
  );
};

export default SidePanel;
