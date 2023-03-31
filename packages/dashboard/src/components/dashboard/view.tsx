import React from 'react';
import { Provider } from 'react-redux';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore, toDashboardState } from '~/store';

import { setupDashboardPlugins } from '~/customization/api';
import plugins from '~/customization/pluginsConfiguration';
import type { DashboardClientConfiguration, DashboardConfiguration } from '~/types';
import { ClientContext } from './clientContext';
import { QueryContext } from './queryContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';

setupDashboardPlugins(plugins);

export type DashboardViewProperties = {
  clientConfiguration: DashboardClientConfiguration;
  dashboardConfiguration: DashboardConfiguration;
};

const DashboardView: React.FC<DashboardViewProperties> = ({ clientConfiguration, dashboardConfiguration }) => {
  return (
    <ClientContext.Provider value={getClients(clientConfiguration)}>
      <QueryContext.Provider value={getQueries(clientConfiguration)}>
        <Provider store={configureDashboardStore({ ...toDashboardState(dashboardConfiguration), readOnly: true })}>
          <InternalDashboard />
        </Provider>
      </QueryContext.Provider>
    </ClientContext.Provider>
  );
};

export default DashboardView;
