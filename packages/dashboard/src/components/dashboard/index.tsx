import React from 'react';
import { Provider } from 'react-redux';

import InternalIotDashboard from '../internalDashboard';

import { configureDashboardStore } from '../../store';
import { DashboardState } from '../../store/state';

export type IotDashboardProps = Pick<DashboardState, 'dashboardConfiguration'>;

const IotDashboard = (props: IotDashboardProps) => (
  <Provider store={configureDashboardStore(props)}>
    <InternalIotDashboard />
  </Provider>
);

export default IotDashboard;
