import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { act } from 'react-dom/test-utils';

import InternalIotDashboard from './index';
import { configureDashboardStore } from '../../store';

describe('InternalIotDashboard', () => {
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
      ReactDOM.render(
        <Provider store={configureDashboardStore(args)}>
          <InternalIotDashboard />
        </Provider>,
        container
      );
    });
    const dashboard = container.querySelector('.iot-dashboard');
    expect(dashboard).toBeTruthy();
  });
});
