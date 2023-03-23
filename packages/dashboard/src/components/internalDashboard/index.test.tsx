import * as React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { render, fireEvent, screen } from '@testing-library/react';

import noop from 'lodash/noop';

import InternalDashboard from './index';
import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';
import { DashboardConfiguration } from '~/types';

const EMPTY_DASHBOARD: DashboardConfiguration = {
  widgets: [],
  viewport: { duration: '5m' },
};

it('saves when the save button is pressed with default grid settings provided', function () {
  const onSave = jest.fn();

  render(
    <Provider store={configureDashboardStore({ dashboardConfiguration: EMPTY_DASHBOARD })}>
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard messageOverrides={DefaultDashboardMessages} onSave={onSave} />
      </DndProvider>
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  expect(onSave).toBeCalledWith({
    dashboardConfiguration: EMPTY_DASHBOARD,
    grid: {
      cellSize: 10,
      height: 100,
      stretchToFit: false,
      width: 100,
    },
  });
});

it('renders preview mode', function () {
  const args = {
    readOnly: true,
    dashboardConfiguration: EMPTY_DASHBOARD,
  };
  render(
    <Provider store={configureDashboardStore(args)}>
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard messageOverrides={DefaultDashboardMessages} />
      </DndProvider>
    </Provider>
  );

  expect(screen.queryByText(/time machine/i)).toBeInTheDocument();
  expect(screen.queryByText(/actions/i)).toBeInTheDocument();
  expect(screen.queryByText(/component library/i)).not.toBeInTheDocument();
});

it('toggles to preview mode and hides the component library', function () {
  const args = {
    readOnly: false,
    dashboardConfiguration: EMPTY_DASHBOARD,
  };

  render(
    <Provider store={configureDashboardStore(args)}>
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard messageOverrides={DefaultDashboardMessages} onSave={noop} />
      </DndProvider>
    </Provider>
  );

  expect(screen.queryByText(/component library/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /preview/i }));

  expect(screen.queryByText(/time machine/i)).toBeInTheDocument();
  expect(screen.queryByText(/actions/i)).toBeInTheDocument();
  expect(screen.queryByText(/component library/i)).not.toBeInTheDocument();
});
