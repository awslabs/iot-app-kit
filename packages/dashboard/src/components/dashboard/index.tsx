import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { merge } from 'lodash';

import { WebglContext } from '@iot-app-kit/react-components';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '../../store';
import { DashboardState, SaveableDashboard } from '../../store/state';
import { PickRequiredOptional, RecursivePartial } from '../../types';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { DashboardMessages, DefaultDashboardMessages } from '../../messages';
import { ClientContext } from './clientContext';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

export type IotDashboardProps = {
  messageOverrides?: RecursivePartial<DashboardMessages>;
  query?: SiteWiseQuery;
  onSave?: (dashboard: SaveableDashboard) => void;
  client?: IoTSiteWiseClient;
} & PickRequiredOptional<DashboardState, 'dashboardConfiguration', 'readOnly' | 'grid'>;

const Dashboard: React.FC<IotDashboardProps> = ({ messageOverrides, query, onSave, client, ...dashboardState }) => {
  return (
    <ClientContext.Provider value={client}>
      <Provider store={configureDashboardStore({ ...dashboardState }, client)}>
        <DndProvider
          backend={TouchBackend}
          options={{
            enableMouseEvents: true,
            enableKeyboardEvents: true,
          }}
        >
          <InternalDashboard
            query={query}
            onSave={onSave}
            messageOverrides={merge(messageOverrides, DefaultDashboardMessages)}
          />
          <WebglContext />
        </DndProvider>
      </Provider>
    </ClientContext.Provider>
  );
};

export default Dashboard;
