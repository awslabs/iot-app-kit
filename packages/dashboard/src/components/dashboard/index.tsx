import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '../../store';
import { DashboardState } from '../../store/state';

export type IotDashboardProps = Pick<DashboardState, 'dashboardConfiguration'>;

const Dashboard = (props: IotDashboardProps) => (
  <Provider store={configureDashboardStore(props)}>
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
        enableKeyboardEvents: true,
      }}
    >
      <InternalDashboard />
    </DndProvider>
  </Provider>
);

export default Dashboard;
