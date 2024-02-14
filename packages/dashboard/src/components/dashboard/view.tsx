import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import { type EdgeMode } from '@iot-app-kit/core';
import { isEdgeModeEnabled } from '@iot-app-kit/core';
import { QueryClientProvider } from '@tanstack/react-query';

import { configureDashboardStore, toDashboardState } from '~/store';
import { useDashboardPlugins } from '~/customization/api';
import type {
  DashboardClientConfiguration,
  DashboardConfiguration,
} from '~/types';
import { ClientContext } from './clientContext';
import { queryClient } from '~/data/query-client';
import { QueryContext } from './queryContext';
import { getClients } from './getClients';
import { getQueries } from './getQueries';
import InternalDashboard from '../internalDashboard';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';

export type DashboardViewProperties = {
  clientConfiguration: DashboardClientConfiguration;
  dashboardConfiguration: DashboardConfiguration;
  edgeMode?: EdgeMode;
};

const DashboardView: React.FC<DashboardViewProperties> = ({
  clientConfiguration,
  dashboardConfiguration,
  edgeMode = 'disabled',
}) => {
  // Adding Dnd provider because custom widgets may have a drag and drop context
  useDashboardPlugins();

  return (
    <ClientContext.Provider value={getClients(clientConfiguration)}>
      <QueryContext.Provider value={getQueries(clientConfiguration, edgeMode)}>
        <QueryClientProvider client={queryClient}>
          <Provider
            store={configureDashboardStore({
              ...toDashboardState(dashboardConfiguration),
              readOnly: true,
              isEdgeModeEnabled: isEdgeModeEnabled(edgeMode),
            })}
          >
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
        </QueryClientProvider>
      </QueryContext.Provider>
    </ClientContext.Provider>
  );
};

export default DashboardView;
