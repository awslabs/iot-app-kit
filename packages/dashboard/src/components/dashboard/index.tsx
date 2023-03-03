import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { merge } from 'lodash';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '~/store';
import { DashboardState, SaveableDashboard } from '~/store/state';
import { PickRequiredOptional, RecursivePartial } from '~/types';
import { DashboardMessages, DefaultDashboardMessages } from '~/messages';
import { ClientContext } from './clientContext';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';

export type DashboardProps = {
  messageOverrides?: RecursivePartial<DashboardMessages>;
  query?: SiteWiseQuery;
  onSave?: (dashboard: SaveableDashboard) => void;
  client?: IoTSiteWiseClient;
  hasEditPermission?: boolean;
} & PickRequiredOptional<DashboardState, 'dashboardConfiguration', 'readOnly' | 'grid'>;

const Dashboard: React.FC<DashboardProps> = ({
  messageOverrides,
  query,
  onSave,
  hasEditPermission = true,
  client,
  ...dashboardState
}) => {
  return (
    <ClientContext.Provider value={client}>
      <Provider store={configureDashboardStore({ ...dashboardState })}>
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
            hasEditPermission={hasEditPermission}
            messageOverrides={merge(messageOverrides, DefaultDashboardMessages)}
          />
        </DndProvider>
      </Provider>
    </ClientContext.Provider>
  );
};

export default Dashboard;
