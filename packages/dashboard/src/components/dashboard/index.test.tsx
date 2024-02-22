import { fireEvent, render, screen } from '@testing-library/react';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';

import Dashboard from './index';
import React from 'react';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

it('renders', function () {
  const { queryByText, queryByTestId } = render(
    <Dashboard
      onSave={() => Promise.resolve()}
      dashboardConfiguration={{
        displaySettings: {
          numColumns: 100,
          numRows: 100,
        },
        widgets: [],
        viewport: { duration: '55m' },
      }}
      clientConfiguration={{
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient:
          createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByTestId(/dashboard-actions/i)).toBeInTheDocument();
  expect(queryByTestId(/time-selection/i)).toBeInTheDocument();
  expect(queryByText('Last 55 minutes')).toBeInTheDocument();
});

it('renders in readonly initially', function () {
  const { baseElement, queryByText, queryByTestId } = render(
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
        iotSiteWiseClient:
          createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
      initialViewMode='preview'
    />
  );

  expect(
    baseElement.querySelector('[data-test-id="read-only-mode-dashboard"]')
  ).toBeTruthy();
  expect(
    baseElement.querySelector('[data-test-id="edit-mode-dashboard"]')
  ).not.toBeTruthy();

  expect(queryByText(/component library/i)).not.toBeInTheDocument();
  expect(queryByTestId(/dashboard-actions/i)).toBeInTheDocument();
  expect(queryByTestId(/time-selection/i)).toBeInTheDocument();
});

it('renders in edit initially', function () {
  const { baseElement } = render(
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
        iotSiteWiseClient:
          createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
      initialViewMode='edit'
    />
  );

  expect(
    baseElement.querySelector('[data-test-id="read-only-mode-dashboard"]')
  ).not.toBeTruthy();
  expect(
    baseElement.querySelector('[data-test-id="edit-mode-dashboard"]')
  ).toBeTruthy();
});

it('passes the correct viewMode to onSave', function () {
  const onSave = jest.fn();

  const savedConfig = {
    displaySettings: {
      numColumns: 100,
      cellSize: 20,
      numRows: 100,
      significantDigits: 4,
    },
    widgets: [],
    viewport: { duration: '55m' },
  };

  render(
    <Dashboard
      onSave={onSave}
      dashboardConfiguration={savedConfig}
      clientConfiguration={{
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient:
          createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
      initialViewMode='edit'
    />
  );

  // in edit mode it passes 'edit' string
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(onSave).toBeCalledWith(savedConfig, 'edit');

  fireEvent.click(screen.getByRole('button', { name: /preview/i }));

  // in preview mode it passes 'preview' string
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(onSave).toBeCalledWith(savedConfig, 'preview');
});

it('renders dashboard name', function () {
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
      name='Test dashboard'
      clientConfiguration={{
        iotEventsClient: createMockIoTEventsSDK(),
        iotSiteWiseClient: createMockSiteWiseSDK() as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/Test dashboard/i)).toBeInTheDocument();
});

it('renders without dashboard name', function () {
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
        iotSiteWiseClient: createMockSiteWiseSDK() as IoTSiteWiseClient,
        iotTwinMakerClient: {
          send: jest.fn(),
        } as unknown as IoTTwinMakerClient,
      }}
    />
  );

  expect(queryByText(/Test dashboard/i)).not.toBeInTheDocument();
});
