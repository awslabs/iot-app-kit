import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { merge } from 'lodash';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';

import { setupDashboardPlugins } from '~/customization/api';
import plugins from '~/customization/pluginsConfiguration';
import type { DashboardState, SaveableDashboard } from '~/store/state';
import type { PickRequiredOptional, RecursivePartial, DashboardClientConfiguration } from '~/types';
import type { DashboardMessages } from '~/messages';
import { ClientContext } from './clientContext';
import { QueryContext } from './queryContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';

setupDashboardPlugins(plugins);

export type DashboardProps = {
  messageOverrides?: RecursivePartial<DashboardMessages>;
  onSave?: (dashboard: SaveableDashboard) => void;
  dashboardClientConfiguration: DashboardClientConfiguration;
  hasEditPermission?: boolean;
} & PickRequiredOptional<DashboardState, 'dashboardConfiguration', 'readOnly' | 'grid'>;

const Dashboard: React.FC<DashboardProps> = ({
  messageOverrides,
  onSave,
  hasEditPermission = true,
  dashboardClientConfiguration,
  ...dashboardState
}) => {
  return (
    <ClientContext.Provider value={getClients(dashboardClientConfiguration)}>
      <QueryContext.Provider value={getQueries(dashboardClientConfiguration)}>
        <Provider store={configureDashboardStore({ ...dashboardState })}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard
              onSave={onSave}
              hasEditPermission={hasEditPermission}
              messageOverrides={merge(messageOverrides, DefaultDashboardMessages)}
            />
          </DndProvider>
        </Provider>
      </QueryContext.Provider>
    </ClientContext.Provider>
  );
};

export default Dashboard;
