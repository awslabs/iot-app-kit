import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { merge } from 'lodash';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '../../store';
import { DashboardState } from '../../store/state';
import { RecursivePartial } from '../../types';
import { DashboardMessages, DefaultDashboardMessages } from '../../messages';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';

export type IotDashboardProps = {
  messageOverrides?: RecursivePartial<DashboardMessages>;
} & Pick<DashboardState, 'dashboardConfiguration'>;

const Dashboard: React.FC<IotDashboardProps> = ({ dashboardConfiguration, messageOverrides }) => (
  <Provider store={configureDashboardStore({ dashboardConfiguration })}>
    <DndProvider
      backend={TouchBackend}
      options={{
        enableMouseEvents: true,
        enableKeyboardEvents: true,
      }}
    >
      <InternalDashboard messageOverrides={merge(messageOverrides, DefaultDashboardMessages)} />
    </DndProvider>
  </Provider>
);

export default Dashboard;
