import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

import Dashboard from './index';
import React from 'react';
import type { DashboardProps } from './index';

describe('Dashboard', () => {
  it('should render', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args: DashboardProps = {
      query: undefined,
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
      client: undefined,
    };

    const root = createRoot(container);

    act(() => {
      root.render(<Dashboard {...args} />);
    });

    const dashboard = container.querySelector('.iot-dashboard');
    expect(dashboard).toBeTruthy();
  });
});
