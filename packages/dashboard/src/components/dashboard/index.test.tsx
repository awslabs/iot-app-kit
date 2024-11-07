import { fireEvent, render, screen } from '@testing-library/react';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';

import { DashboardWrapper as Dashboard } from './wrapper';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import {
  IoTSiteWise,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { type RefreshRate } from '../refreshRate/types';

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
  const { queryByText, findByTestId } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
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

  expect(await findByTestId(/dashboard-actions/i)).toBeInTheDocument();
  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByText(/component library/i)).not.toBeInTheDocument();
});

it('renders in readonly initially', async () => {
  const { queryByTestId, queryByText, findByTestId } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
      initialViewMode='preview'
    />
  );

  expect(await findByTestId(/read-only-mode-dashboard/i)).toBeInTheDocument();
  expect(queryByTestId(/edit-mode-dashboard/i)).toBeNull();
  expect(await findByTestId(/dashboard-actions/i)).toBeInTheDocument();
  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByText(/component library/i)).not.toBeInTheDocument();
});

it('renders in edit initially', async () => {
  const { findByTestId, queryByTestId } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
      initialViewMode='edit'
    />
  );

  expect(await findByTestId(/edit-mode-dashboard/i)).toBeInTheDocument();
  expect(queryByTestId(/read-only-mode-dashboard/i)).toBeNull();
});

it('passes the correct viewMode to onSave', function () {
  const onSave = jest.fn();

  const savedConfig = {
    displaySettings: {
      numColumns: 100,
      cellSize: 20,
      numRows: 100,
      significantDigits: 4,
    },
    querySettings: {
      refreshRate: 5000 as RefreshRate,
    },
    widgets: [],
  };

  render(
    <Dashboard
      onSave={onSave}
      dashboardConfiguration={savedConfig}
      clientConfiguration={clients}
      initialViewMode='edit'
    />
  );

  // in edit mode it passes 'edit' string
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(onSave).toBeCalledWith(savedConfig, 'edit');

  fireEvent.click(screen.getByRole('button', { name: /preview/i }));

  // in preview mode it passes 'preview' string
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(onSave).toBeCalledWith(savedConfig, 'preview');
});

it('renders dashboard name', async () => {
  const { findByText } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      name='Test dashboard'
      clientConfiguration={clients}
    />
  );

  expect(await findByText(/Test dashboard/i)).toBeInTheDocument();
});

it('renders without dashboard name', async () => {
  const { queryByText, findByTestId } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
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

  expect(await findByTestId(/dashboard-actions/i)).toBeInTheDocument();
  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByText(/Test dashboard/i)).not.toBeInTheDocument();
});

it('assistant disabled by default in the dashboard', async () => {
  const { queryByTestId, findByTestId } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
      initialViewMode='preview'
    />
  );

  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByTestId('dashboard-chatbot')).toBeNull();
});

it('assistant enabled in the dashboard when state is PASSIVE', async () => {
  const { findByRole } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
      initialViewMode='preview'
      assistantConfiguration={{
        state: 'PASSIVE',
      }}
    />
  );

  expect(
    await findByRole('button', { name: 'AI Assistant' })
  ).toBeInTheDocument();
});

it('assistant disabled in the dashboard when state is DISABLED', async () => {
  const { queryByRole, findByTestId } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '5m' },
      }}
      clientConfiguration={clients}
      initialViewMode='preview'
      assistantConfiguration={{
        state: 'DISABLED',
      }}
    />
  );

  expect(await findByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByRole('button', { name: 'AI Assistant' })).toBeNull();
});
