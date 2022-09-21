import React from 'react';
import { DashboardConfiguration } from '../../types';

export type IotDashboardProps = {
  dashboardConfiguration: DashboardConfiguration;
};

const IotDashboard = ({ dashboardConfiguration }: IotDashboardProps) => {
  return <div className="iot-dashboard">Dashboard {JSON.stringify(dashboardConfiguration)}</div>;
};

export default IotDashboard;
