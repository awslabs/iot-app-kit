import { render } from '@testing-library/react';
import { createMockIoTEventsSDK, createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import Dashboard from './index';
import React from 'react';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

it('renders', function () {
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
        iotTwinMakerClient: { send: jest.fn() } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByText(/actions/i)).toBeInTheDocument();
  expect(queryByText(/time machine/i)).toBeInTheDocument();
});

it('renders in readonly initially', function () {
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
        iotTwinMakerClient: { send: jest.fn() } as unknown as IoTTwinMakerClient,
      }}
      initialViewMode='preview'
    />
  );

  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByText(/actions/i)).toBeInTheDocument();
  expect(queryByText(/time machine/i)).toBeInTheDocument();
});
