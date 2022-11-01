import * as React from 'react';
import { act } from 'react-dom/test-utils';
import * as ReactDOM from 'react-dom';

import IotDashboard from './index';

describe('IotDashboard', () => {
  it('should render', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args = {
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
    };

    act(() => {
      ReactDOM.render(<IotDashboard {...args} />, container);
    });
    const dashboard = container.querySelector('.iot-dashboard');
    expect(dashboard).toBeTruthy();
  });
});
