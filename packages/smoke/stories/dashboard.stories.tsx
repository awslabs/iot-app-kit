import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createMockSiteWiseSDK, createMockIoTEventsSDK } from '@iot-app-kit/testing-util';
import { Dashboard } from '@iot-app-kit/dashboard';

import { TestSelectorComponent } from './utils/testSelector';

export default {
  title: 'Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Dashboard>;

export const SmokeTest: ComponentStory<typeof Dashboard> = () => (
  <>
    <Dashboard
      clientConfiguration={{
        iotSiteWiseClient: createMockSiteWiseSDK(),
        iotEventsClient: createMockIoTEventsSDK(),
      }}
      onSave={() => Promise.resolve()}
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 10,
          numRows: 10,
        },
        viewport: { duration: '5m' },
        widgets: [],
      }}
    />;
    {/* Used to check if the page actually loaded */}
    <TestSelectorComponent />
  </>
);
