import { render } from '@testing-library/react';
import { createMockIoTEventsSDK, createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import Dashboard from './index';
import React from 'react';

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
        iotSiteWiseClient: createMockSiteWiseSDK(),
      }}
    />
  );

  expect(queryByText(/component library/i)).toBeInTheDocument();
  expect(queryByText(/actions/i)).toBeInTheDocument();
  expect(queryByText(/time machine/i)).toBeInTheDocument();
});
