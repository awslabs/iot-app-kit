import * as React from 'react';
import { act } from 'react-dom/test-utils';
import * as ReactDOM from 'react-dom';

import Dashboard, { IotDashboardProps } from './index';

describe('Dashboard', () => {
  it('should render', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args: IotDashboardProps = {
      query: undefined,
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
      client: undefined,
    };

    act(() => {
      ReactDOM.render(<Dashboard {...args} />, container);
    });
    const dashboard = container.querySelector('.iot-dashboard');
    expect(dashboard).toBeTruthy();
  });
});
