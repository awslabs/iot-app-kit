import { render } from '@testing-library/react';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import {
  IoTSiteWise,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

import DashboardView from './view';
import React from 'react';

const config = {
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  },
  region: 'test-region',
};

const clients = {
  iotEventsClient: createMockIoTEventsSDK(),
  iotSiteWiseClient: {
    ...createMockSiteWiseSDK(),
    config,
  } as unknown as IoTSiteWiseClient,
  iotTwinMakerClient: {
    send: jest.fn(),
  } as unknown as IoTTwinMakerClient,
  iotSiteWise: new IoTSiteWise(),
};

it('renders', async () => {
  const { queryByText, queryByTestId, findByTestId } = render(
    <DashboardView
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
    />
  );

  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByTestId(/dashboard-visibility-button/i)).not.toBeInTheDocument();
});

it('assistant disabled by default in the dashboard view', async () => {
  const { queryByTestId, findByTestId } = render(
    <DashboardView
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
    />
  );

  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByTestId('dashboard-chatbot')).toBeNull();
});

it('assistant enabled in the dashboard when state is PASSIVE', async () => {
  const { queryByRole, findByTestId } = render(
    <DashboardView
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
      assistantConfiguration={{
        state: 'PASSIVE',
      }}
    />
  );

  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByRole('button', { name: 'AI Assistant' })).not.toBeNull();
});

it('assistant disabled in the dashboard when state is DISABLED', async () => {
  const { queryByRole, findByTestId } = render(
    <DashboardView
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
      assistantConfiguration={{
        state: 'DISABLED',
      }}
    />
  );

  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByRole('button', { name: 'AI Assistant' })).toBeNull();
});
