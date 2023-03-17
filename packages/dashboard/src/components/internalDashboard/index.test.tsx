import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import { act } from '@testing-library/react';

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

    const root = createRoot(container);

    act(() => {
      root.render(
        <Provider store={configureDashboardStore(args)}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard hasEditPermission={true} query={undefined} messageOverrides={DefaultDashboardMessages} />
          </DndProvider>
        </Provider>
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
    };
    const onSave = jest.fn(noop);

    const root = createRoot(container);

    act(() => {
      root.render(
        <Provider store={configureDashboardStore(args)}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard
              hasEditPermission={true}
              query={undefined}
              messageOverrides={DefaultDashboardMessages}
              onSave={onSave}
            />
          </DndProvider>
        </Provider>
      );
    });
    const actionsContainer = container.querySelector('.actions');
    expect(actionsContainer).toBeTruthy();

    act(() => {
      if (!actionsContainer) throw new Error('No actions on dashboard');
      wrapper(actionsContainer).findButton('[data-test-id="actions-save-dashboard-btn"]')?.click();
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

    const root = createRoot(container);

    act(() => {
      root.render(
        <Provider store={configureDashboardStore(args)}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard hasEditPermission={true} query={undefined} messageOverrides={DefaultDashboardMessages} />
          </DndProvider>
        </Provider>
      );
    });

    expect(container.querySelector('.viewport-selection')).toBeTruthy();
    expect(container.querySelector('.iot-dashboard-panes-area')).toBeFalsy();
  });

  it('can toggle to readonly mode', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args = {
      readOnly: false,
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
    };

    const root = createRoot(container);

    act(() => {
      root.render(
        <Provider store={configureDashboardStore(args)}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard hasEditPermission={true} query={undefined} messageOverrides={DefaultDashboardMessages} />
          </DndProvider>
        </Provider>
      );
    });

    const actionsContainer = container.querySelector('.button-actions');
    expect(actionsContainer).toBeTruthy();

    act(() => {
      if (!actionsContainer) throw new Error('No actions on dashboard');
      const foundButton = wrapper(actionsContainer).findButton('[data-test-id="actions-toggle-read-only-btn"]');
      foundButton?.click();
    });

    const dashboard = container.querySelector('.iot-dashboard-panes-area');
    expect(dashboard).toBeFalsy();
  });

  it('cannot toggle to edit mode if no edit permissions', function () {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const args = {
      readOnly: true,
      dashboardConfiguration: {
        widgets: [],
        viewport: { duration: '5m' },
      },
    };
    const root = createRoot(container);

    act(() => {
      root.render(
        <Provider store={configureDashboardStore(args)}>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableKeyboardEvents: true,
            }}
          >
            <InternalDashboard
              hasEditPermission={false}
              query={undefined}
              messageOverrides={DefaultDashboardMessages}
            />
          </DndProvider>
        </Provider>
      );
    });

    const actionsContainer = container.querySelector('.button-actions');
    expect(actionsContainer).toBeFalsy();

    const dashboard = container.querySelector('.iot-dashboard-panes-area');
    expect(dashboard).toBeFalsy();
  });
});
