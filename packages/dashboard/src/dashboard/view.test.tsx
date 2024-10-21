import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';
import { render } from '@testing-library/react';
import React from 'react';
import DashboardView from './view';

const config = {
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  },
  region: 'test-region',
};

it('renders', function () {
  const { queryByText, queryByTestId } = render(
    <DashboardView
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
        iotSiteWiseClient: {
          ...createMockSiteWiseSDK(),
          config,
        } as unknown as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByTestId(/dashboard-visibility-button/i)).not.toBeInTheDocument();
  expect(queryByTestId(/time-selection/i)).toBeInTheDocument();
});
