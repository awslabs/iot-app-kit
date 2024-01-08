import { render } from '@testing-library/react';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';

import Dashboard from './index';
import React from 'react';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

it('renders', function () {
  const { queryByText, queryByTestId } = render(
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
      clientConfiguration={{
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient:
          createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByTestId(/dashboard-actions/i)).toBeInTheDocument();
  expect(queryByTestId(/time-selection/i)).toBeInTheDocument();
});

it('renders in readonly initially', function () {
  const { queryByText, queryByTestId } = render(
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
      clientConfiguration={{
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient:
          createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
      initialViewMode='preview'
    />
  );

  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByTestId(/dashboard-actions/i)).toBeInTheDocument();
  expect(queryByTestId(/time-selection/i)).toBeInTheDocument();
});

it('renders dashboard name', function () {
  const { queryByText } = render(
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
      clientConfiguration={{
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient: createMockSiteWiseSDK() as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/Test dashboard/i)).toBeInTheDocument();
});

it('renders without dashboard name', function () {
  const { queryByText } = render(
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
      clientConfiguration={{
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient: createMockSiteWiseSDK() as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/Test dashboard/i)).not.toBeInTheDocument();
});
