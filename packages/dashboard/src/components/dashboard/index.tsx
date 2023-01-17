import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { merge } from 'lodash';

import { WebglContext } from '@iot-app-kit/react-components';

import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '../../store';
import { DashboardState, SaveableDashboard } from '../../store/state';
import { RecursivePartial } from '../../types';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { DashboardMessages, DefaultDashboardMessages } from '../../messages';

import '@cloudscape-design/global-styles/index.css';
import '../../styles/variables.css';

export type IotDashboardProps = {
  messageOverrides?: RecursivePartial<DashboardMessages>;
  query?: SiteWiseQuery;
  onSave?: (dashboard: SaveableDashboard) => void;
} & Pick<DashboardState, 'dashboardConfiguration'>;

const Dashboard: React.FC<IotDashboardProps> = ({ dashboardConfiguration, messageOverrides, query, onSave }) => (
  <Provider store={configureDashboardStore({ dashboardConfiguration })}>
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
);

export default Dashboard;
