import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { merge } from 'lodash';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';
import { ClientContext } from './clientContext';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';
import { DataSourceProvider } from '~/customization/hooks/useDataSource';
import { setupDashboardPlugins } from '~/customization/api';
import plugins from '~/customization/pluginsConfiguration';
import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import type { DashboardState, SaveableDashboard } from '~/store/state';
import type { PickRequiredOptional, RecursivePartial } from '~/types';
import type { DashboardMessages } from '~/messages';

setupDashboardPlugins(plugins);

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
          <DataSourceProvider query={query}>
            <InternalDashboard
              query={query}
              onSave={onSave}
              hasEditPermission={hasEditPermission}
              messageOverrides={merge(messageOverrides, DefaultDashboardMessages)}
            />
          </DataSourceProvider>
        </DndProvider>
      </Provider>
    </ClientContext.Provider>
  );
};

export default Dashboard;
