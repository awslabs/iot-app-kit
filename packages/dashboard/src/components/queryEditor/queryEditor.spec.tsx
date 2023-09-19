import { IoTSiteWiseClient, type ListTimeSeriesResponse } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';

import { server } from '~/msw/server';
import { rest } from 'msw';

import { QueryEditor } from './queryEditor';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import {
  AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_2_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_3_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_4_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_SUMMARY,
  AFRICA_SITE_ASSET_SUMMARY,
  ANTARCTICA_SITE_ASSET_SUMMARY,
  ASIA_SITE_ASSET_SUMMARY,
  AUSTRALIA_SITE_ASSET_SUMMARY,
  EUROPE_SITE_ASSET_SUMMARY,
  NORTH_AMERICA_SITE_ASSET_SUMMARY,
  SOUTH_AMERICA_SITE_ASSET_SUMMARY,
  COORDINATES_ASSET_PROPERTY,
  PRODUCTION_RATE_ASSET_PROPERTY,
} from '~/msw/handlers/iot-sitewise/constants';
import { DEFAULT_REGION } from '~/msw/constants';
import { paginatedListAssetsHandler } from '~/msw/handlers/iot-sitewise/listAssets/paginatedListAssetsHandler';

function TestQueryEditor() {
  return (
    <Provider
      store={configureDashboardStore({
        dashboardConfiguration: {
          widgets: [],
          viewport: { duration: '5m' },
        },
      })}
    >
      <QueryClientProvider client={new QueryClient()}>
        <QueryEditor
          iotSiteWiseClient={
            new IoTSiteWiseClient({
              region: DEFAULT_REGION,
              credentials: {
                accessKeyId: 'accessKeyId',
                secretAccessKey: 'secretAccessKey',
              },
            })
          }
          iotTwinMakerClient={
            new IoTTwinMakerClient({
              region: DEFAULT_REGION,
              credentials: {
                accessKeyId: 'accessKeyId',
                secretAccessKey: 'secretAssetKey',
              },
            })
          }
        />
      </QueryClientProvider>
    </Provider>
  );
}

describe.skip(QueryEditor, () => {
  describe('default rendering', () => {
    test('modeled tab renders as expected', () => {
      render(<TestQueryEditor />);

      expect(screen.getByRole('tab', { name: 'Modeled', selected: true })).toBeVisible();
      expect(screen.getByRole('tab', { name: 'Unmodeled', selected: false })).toBeVisible();
      expect(screen.getByLabelText('Workspace')).toBeVisible();
      expect(screen.getByText('Select a workspace.')).toBeVisible();
      expect(screen.getByLabelText('Search query')).toBeVisible();
      expect(screen.getByPlaceholderText('Enter a search query')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Search' })).toBeVisible();
      expect(screen.getByRole('heading', { name: 'Browse assets' })).toBeVisible();
      expect(screen.getByText('Browse through your asset hierarchy and select an asset.')).toBeVisible();
      expect(screen.getByPlaceholderText('Filter assets by text, property, or value')).toBeVisible();
      expect(screen.getByText('Root')).toBeVisible();
      expect(screen.getByRole('heading', { name: 'Modeled data streams' })).toBeVisible();
      expect(screen.getByPlaceholderText('Filter modeled data streams by text, property, or value')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Add' })).toBeVisible();
      expect(screen.getByText('No modeled data streams')).toBeVisible();
      expect(screen.getByText('No modeled data streams found for selected asset.')).toBeVisible();
    });

    test('unmodeled tab renders as expected', async () => {
      const user = userEvent.setup();
      render(<TestQueryEditor />);

      await user.click(screen.getByRole('tab', { name: 'Unmodeled', selected: false }));

      expect(screen.getByRole('tab', { name: 'Unmodeled', selected: true })).toBeVisible();
      expect(screen.getByRole('tab', { name: 'Modeled', selected: false })).toBeVisible();
      expect(screen.getByLabelText('Alias prefix - optional')).toBeVisible();
      expect(screen.getByText('Enter an alias prefix to filter the list of unmodeled data streams.')).toBeVisible();
      expect(screen.getByPlaceholderText('Enter an alias prefix')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Search' })).toBeVisible();
      expect(screen.getByRole('heading', { name: 'Unmodeled data streams' })).toBeVisible();
      expect(screen.getByPlaceholderText('Filter unmodeled data streams by text, property, or value')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Add' })).toBeVisible();
    });
  });

  describe('tab switching', () => {
    test('user can switch to unmodeled tab', async () => {
      const user = userEvent.setup();
      render(<TestQueryEditor />);

      await user.click(screen.getByRole('tab', { name: 'Unmodeled', selected: false }));

      expect(screen.getByRole('tab', { name: 'Unmodeled', selected: true })).toBeVisible();
      expect(screen.getByRole('tab', { name: 'Modeled', selected: false })).toBeVisible();
    });

    test('user can switch back to modeled tab', async () => {
      const user = userEvent.setup();
      render(<TestQueryEditor />);

      await user.click(screen.getByRole('tab', { name: 'Unmodeled', selected: false }));
      await user.click(screen.getByRole('tab', { name: 'Modeled', selected: false }));

      expect(screen.getByRole('tab', { name: 'Modeled', selected: true })).toBeVisible();
      expect(screen.getByRole('tab', { name: 'Unmodeled', selected: false })).toBeVisible();
    });
  });

  describe('adding data streams', () => {
    test('modeled data streams add button is disabled when no data streams are selected', () => {
      render(<TestQueryEditor />);

      const addButton = screen.getByRole('button', { name: 'Add' });

      expect(addButton).toBeDisabled();
    });

    test('unmodeled data streams add button is disabled when no data streams are selected', async () => {
      const user = userEvent.setup();
      render(<TestQueryEditor />);

      await user.click(screen.getByRole('tab', { name: 'Unmodeled' }));

      const addButton = screen.getByRole('button', { name: 'Add' });

      expect(addButton).toBeDisabled();
    });
  });

  describe('modeled data stream exploration', () => {
    test('user does something', async () => {
      const user = userEvent.setup();
      render(<TestQueryEditor />);

      expect(screen.getByRole('heading', { name: 'Browse assets' })).toBeVisible();

      const loadingMessage = screen.queryByText('Loading assets...');

      if (loadingMessage) {
        await waitForElementToBeRemoved(loadingMessage);
      }

      expect(screen.getByText(AFRICA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(ANTARCTICA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(ASIA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(AUSTRALIA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(EUROPE_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(NORTH_AMERICA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(SOUTH_AMERICA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();

      await user.click(screen.getByText(AFRICA_SITE_ASSET_SUMMARY.name ?? ''));

      await waitFor(() => screen.getByText(AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY.name ?? ''));

      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_2_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_3_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_4_ASSET_SUMMARY.name ?? '')).toBeVisible();

      await user.click(screen.getByText(AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY.name ?? ''));

      await waitFor(() => screen.getByText(AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_SUMMARY.name ?? ''));

      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_SUMMARY.name ?? ''));
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_SUMMARY.name ?? ''));
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_SUMMARY.name ?? ''));
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_SUMMARY.name ?? ''));
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_SUMMARY.name ?? ''));
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_SUMMARY.name ?? ''));
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_SUMMARY.name ?? ''));
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_SUMMARY.name ?? ''));

      await user.click(screen.getByText(AFRICA_SITE_ASSET_SUMMARY.name ?? ''));

      expect(screen.getByText(AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_2_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_3_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(AFRICA_PRODUCTION_LINE_4_ASSET_SUMMARY.name ?? '')).toBeVisible();

      await user.click(screen.getByText('Root'));

      expect(screen.getByText(AFRICA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(ANTARCTICA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(ASIA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(AUSTRALIA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(EUROPE_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(NORTH_AMERICA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
      expect(screen.getByText(SOUTH_AMERICA_SITE_ASSET_SUMMARY.name ?? '')).toBeVisible();
    });

    test('modeled data streams visible', async () => {
      const user = userEvent.setup();
      render(<TestQueryEditor />);

      const loadingMessage = screen.queryByText('Loading assets...');

      if (loadingMessage) {
        await waitForElementToBeRemoved(loadingMessage);
      }

      await user.click(screen.getByRole('radio', { name: `Select asset ${AFRICA_SITE_ASSET_SUMMARY.name}` }));

      const modeledDataStreamLoadingMessage = screen.queryByText('Loading modeled data streams...');

      if (modeledDataStreamLoadingMessage) {
        await waitForElementToBeRemoved(modeledDataStreamLoadingMessage);
      }

      expect(screen.getByText(COORDINATES_ASSET_PROPERTY.name)).toBeVisible();
      expect(screen.getByText(PRODUCTION_RATE_ASSET_PROPERTY.name)).toBeVisible();

      expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();

      await user.click(
        screen.getByRole('checkbox', { name: `Select modeled data stream ${COORDINATES_ASSET_PROPERTY.name}` })
      );

      expect(screen.getByRole('button', { name: 'Add' })).not.toBeDisabled();

      await user.click(
        screen.getByRole('checkbox', { name: `Select modeled data stream ${COORDINATES_ASSET_PROPERTY.name}` })
      );

      expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
    });

    test('asset selection is lost when clicking to view asset children', async () => {
      const user = userEvent.setup();
      render(<TestQueryEditor />);

      const loadingMessage = screen.queryByText('Loading assets...');

      if (loadingMessage) {
        await waitForElementToBeRemoved(loadingMessage);
      }

      await user.click(screen.getByRole('radio', { name: `Select asset ${AFRICA_SITE_ASSET_SUMMARY.name}` }));

      const modeledDataStreamLoadingMessage = screen.queryByText('Loading modeled data streams...');

      if (modeledDataStreamLoadingMessage) {
        await waitForElementToBeRemoved(modeledDataStreamLoadingMessage);
      }

      expect(screen.getByText(COORDINATES_ASSET_PROPERTY.name)).toBeVisible();
      expect(screen.getByText(PRODUCTION_RATE_ASSET_PROPERTY.name)).toBeVisible();

      await user.click(screen.getByText(AFRICA_SITE_ASSET_SUMMARY.name ?? ''));

      await waitFor(() => screen.getByText('No modeled data streams'));

      expect(screen.queryByText(COORDINATES_ASSET_PROPERTY.name)).not.toBeInTheDocument();
      expect(screen.queryByText(PRODUCTION_RATE_ASSET_PROPERTY.name)).not.toBeInTheDocument();
    });

    test('asset selection is lost when paginating', async () => {
      server.use(paginatedListAssetsHandler());
      const user = userEvent.setup();
      render(<TestQueryEditor />);

      const loadingMessage = screen.queryByText('Loading assets...');

      if (loadingMessage) {
        await waitForElementToBeRemoved(loadingMessage);
      }

      expect(screen.getByRole('button', { name: 'Next page assets' })).not.toBeDisabled();

      await user.click(screen.getByRole('radio', { name: `Select asset ${AFRICA_SITE_ASSET_SUMMARY.name}` }));

      const modeledDataStreamLoadingMessage = screen.queryByText('Loading modeled data streams...');

      if (modeledDataStreamLoadingMessage) {
        await waitForElementToBeRemoved(modeledDataStreamLoadingMessage);
      }

      expect(screen.getByText(COORDINATES_ASSET_PROPERTY.name)).toBeVisible();
      expect(screen.getByText(PRODUCTION_RATE_ASSET_PROPERTY.name)).toBeVisible();

      await user.click(screen.getByRole('button', { name: 'Next page assets' }));

      await waitFor(() => screen.getByText('No modeled data streams'));

      expect(screen.queryByText(COORDINATES_ASSET_PROPERTY.name)).not.toBeInTheDocument();
      expect(screen.queryByText(PRODUCTION_RATE_ASSET_PROPERTY.name)).not.toBeInTheDocument();
    });
  });

  describe.skip('unmodeled data stream search', () => {
    test('user searches for data streams and none are returned', async () => {
      server.use(
        rest.get('https://api.iotsitewise.us-east-1.amazonaws.com/timeseries', (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              TimeSeriesSummaries: [],
              nextToken: undefined,
            } satisfies ListTimeSeriesResponse)
          )
        )
      );

      const user = userEvent.setup();
      render(
        <QueryClientProvider client={new QueryClient()}>
          <QueryEditor iotSiteWiseClient={new IoTSiteWiseClient({})} iotTwinMakerClient={new IoTTwinMakerClient({})} />
        </QueryClientProvider>
      );

      await user.click(screen.getByRole('tab', { name: 'Unmodeled', selected: false }));

      const searchInput = screen.getByPlaceholderText('Enter an alias prefix');

      await user.type(searchInput, 'A/B/C');

      await user.click(screen.getByRole('button', { name: 'Search' }));

      const loadingMessage = screen.queryByText('Loading asset properties...');

      if (loadingMessage) {
        await waitForElementToBeRemoved(loadingMessage);
      }

      await waitFor(() => expect(screen.getByText('No unmodeled data streams.')).toBeVisible());
      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    });

    test('user searches for data streams and a single page is returned', async () => {
      server.use(
        rest.get('https://api.iotsitewise.us-east-1.amazonaws.com/timeseries', (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              TimeSeriesSummaries: [
                {
                  timeSeriesArn:
                    'arn:aws:iotsitewise:us-west-2:123456789012:timeseries/12345678-abcd-1234-abcd-123456789012',
                  timeSeriesId: '12345678-abcd-1234-abcd-123456789012',
                  alias: 'data stream 1',
                  dataType: 'STRING',
                  timeSeriesCreationDate: new Date(0),
                  timeSeriesLastUpdateDate: new Date(0),
                },
                {
                  timeSeriesArn:
                    'arn:aws:iotsitewise:us-west-2:123456789012:timeseries/12345678-abcd-1234-abcd-123456789012',
                  timeSeriesId: '12345678-abcd-1234-abcd-123456789012',
                  alias: 'data stream 2',
                  dataType: 'STRING',
                  timeSeriesCreationDate: new Date(0),
                  timeSeriesLastUpdateDate: new Date(0),
                },
              ],
              nextToken: undefined,
            } satisfies ListTimeSeriesResponse)
          )
        )
      );

      const user = userEvent.setup();
      render(
        <QueryClientProvider client={new QueryClient()}>
          <QueryEditor iotSiteWiseClient={new IoTSiteWiseClient({})} iotTwinMakerClient={new IoTTwinMakerClient({})} />
        </QueryClientProvider>
      );

      await user.click(screen.getByRole('tab', { name: 'Unmodeled', selected: false }));

      const searchInput = screen.getByPlaceholderText('Enter an alias prefix');

      await user.type(searchInput, 'data stream');

      await user.click(screen.getByRole('button', { name: 'Search' }));

      const loadingMessage = screen.queryByText('Loading unmodeled data streams...');

      if (loadingMessage) {
        await waitForElementToBeRemoved(loadingMessage);
      }

      expect(screen.queryByText('No unmodeled data streams.')).not.toBeInTheDocument();

      expect(screen.getByText('data stream 1')).toBeVisible();
      expect(screen.getByText('data stream 2')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    });

    test('user searches for data streams and multiple pages are available', async () => {
      server.use(
        rest.get('https://api.iotsitewise.us-west-2.amazonaws.com/timeseries', (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              TimeSeriesSummaries: [
                {
                  timeSeriesArn:
                    'arn:aws:iotsitewise:us-west-2:123456789012:timeseries/12345678-abcd-1234-abcd-123456789012',
                  timeSeriesId: '12345678-abcd-1234-abcd-123456789012',
                  alias: 'data stream 1',
                  dataType: 'STRING',
                  timeSeriesCreationDate: new Date(0),
                  timeSeriesLastUpdateDate: new Date(0),
                },
                {
                  timeSeriesArn:
                    'arn:aws:iotsitewise:us-west-2:123456789012:timeseries/12345678-abcd-1234-abcd-123456789012',
                  timeSeriesId: '12345678-abcd-1234-abcd-123456789012',
                  alias: 'data stream 2',
                  dataType: 'STRING',
                  timeSeriesCreationDate: new Date(0),
                  timeSeriesLastUpdateDate: new Date(0),
                },
              ],
              nextToken: 'nextToken',
            } satisfies ListTimeSeriesResponse)
          )
        )
      );

      const user = userEvent.setup();
      render(
        <QueryClientProvider client={new QueryClient()}>
          <QueryEditor iotSiteWiseClient={new IoTSiteWiseClient({})} iotTwinMakerClient={new IoTTwinMakerClient({})} />
        </QueryClientProvider>
      );

      await user.click(screen.getByRole('tab', { name: 'Unmodeled', selected: false }));

      const searchInput = screen.getByPlaceholderText('Enter an alias prefix');

      await user.type(searchInput, 'data stream');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      const loadingMessage = screen.queryByText('Loading unmodeled data streams...');

      if (loadingMessage) {
        await waitForElementToBeRemoved(loadingMessage);
      }

      expect(screen.queryByText('No unmodeled data streams.')).not.toBeInTheDocument();

      expect(screen.getByText('data stream 1')).toBeVisible();
      expect(screen.getByText('data stream 2')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
    });
  });
});
