import { render } from '@testing-library/react';
import { createMockIoTEventsSDK, createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import Dashboard from './index';
import React from 'react';

it('renders', function () {
  const { queryByText } = render(
    <Dashboard
      dashboardConfiguration={{
        widgets: [],
        viewport: { duration: '5m' },
      }}
      dashboardClientConfiguration={{
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient: createMockSiteWiseSDK(),
      }}
    />
  );

  expect(queryByText(/component library/i)).toBeInTheDocument();
  expect(queryByText(/actions/i)).toBeInTheDocument();
  expect(queryByText(/time machine/i)).toBeInTheDocument();
});
