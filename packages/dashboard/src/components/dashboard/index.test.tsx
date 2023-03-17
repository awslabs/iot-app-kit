import { act } from '@testing-library/react';
import { createRoot } from 'react-dom/client';

import { createMockIoTEventsSDK, createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import type { DashboardProps } from './index';
import Dashboard from './index';
import React from 'react';

describe('Dashboard', () => {
  it('should render', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args: DashboardProps = {
      dashboardClientConfiguration: {
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient: createMockSiteWiseSDK(),
      },
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
    };

    const root = createRoot(container);

    act(() => {
      root.render(<Dashboard {...args} />);
    });

    const dashboard = container.querySelector('.iot-dashboard');
    expect(dashboard).toBeTruthy();
  });
});
