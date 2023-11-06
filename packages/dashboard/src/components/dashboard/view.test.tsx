import { render } from '@testing-library/react';
import { createMockIoTEventsSDK, createMockSiteWiseSDK } from '@iot-app-kit/testing-util';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import DashboardView from './view';
import React from 'react';

it('renders', function () {
  const { queryByText } = render(
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
        iotSiteWiseClient: createMockSiteWiseSDK() as IoTSiteWiseClient,
        iotTwinMakerClient: { send: jest.fn() } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByText(/actions/i)).not.toBeInTheDocument();
  expect(queryByText(/time machine/i)).toBeInTheDocument();
});
