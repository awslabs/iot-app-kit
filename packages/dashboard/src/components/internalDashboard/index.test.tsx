import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import { act } from 'react-dom/test-utils';

import wrapper from '@cloudscape-design/components/test-utils/dom';

import noop from 'lodash/noop';

import InternalDashboard from './index';
import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';

describe('InternalDashboard', () => {
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
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard query={undefined} messageOverrides={DefaultDashboardMessages} />
          </DndProvider>
        </Provider>,
        container
      );
    });
    const dashboard = container.querySelector('.iot-dashboard');
    expect(dashboard).toBeTruthy();
  });

  it('should be saveable', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args = {
      grid: {
        width: 100,
        height: 100,
        cellSize: 10,
        stretchToFit: false,
      },
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
      assetsDescriptionMap: {},
    };
    const onSave = jest.fn(noop);

    act(() => {
      ReactDOM.render(
        <Provider store={configureDashboardStore(args)}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard query={undefined} messageOverrides={DefaultDashboardMessages} onSave={onSave} />
          </DndProvider>
        </Provider>,
        container
      );
    });
    const actionsContainer = container.querySelector('.actions');
    expect(actionsContainer).toBeTruthy();

    act(() => {
      if (!actionsContainer) throw new Error('No actions on dashboard');
      wrapper(actionsContainer).findButton()?.click();
    });

    expect(onSave).toBeCalledWith(args);
  });

  it('can display in readonly mode', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args = {
      readOnly: true,
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
    };

    act(() => {
      ReactDOM.render(
        <Provider store={configureDashboardStore(args)}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard query={undefined} messageOverrides={DefaultDashboardMessages} />
          </DndProvider>
        </Provider>,
        container
      );
    });

    expect(container.querySelector('.viewport-selection')).toBeTruthy();
    expect(container.querySelector('.iot-dashboard-panes-area')).toBeFalsy();
  });
});
