import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { TimeSeriesExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../requests';
import * as table from '../helpers/table';
import { createListTimeSeriesPage } from '../helpers/responses';
import { BatchGetAssetPropertyValue, ListTimeSeries } from '@iot-app-kit/core';
import { TimeSeriesResource } from '../../types/resources';
import { SelectionMode } from '../../types/common';
import { DEFAULT_LATEST_VALUE_REQUEST_INTERVAL } from '../../constants/defaults';
import { formatDate } from '../../../../utils/time';

function SelectableTimeSeriesTable({
  selectionMode,
  listTimeSeries,
}: {
  selectionMode?: SelectionMode;
  listTimeSeries: ListTimeSeries;
}) {
  const [selectedTimeSeries, setSelectedTimeSeries] = useState<
    TimeSeriesResource[]
  >([]);

  return (
    <TimeSeriesExplorer
      requestFns={{ listTimeSeries }}
      parameters={[{ assetId: 'asset-id' }]}
      selectionMode={selectionMode}
      selectedTimeSeries={selectedTimeSeries}
      onSelectTimeSeries={setSelectedTimeSeries}
    />
  );
}

describe('time series table', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describe('rendering', () => {
    it('renders a table without configuration', async () => {
      render(<TimeSeriesExplorer />);

      expect(screen.getByRole('table')).toBeVisible();
      expect(screen.getByText(`No time series.`));

      // Title
      expect(screen.getByText('Time series'));
      expect(screen.getByText('(0)')).toBeVisible();

      // Search
      expect(table.querySearchField()).not.toBeInTheDocument();

      // Filter
      expect(screen.queryByLabelText('Filter')).not.toBeInTheDocument();

      // User settings
      expect(
        screen.queryByRole('button', { name: 'Preferences' })
      ).not.toBeInTheDocument();

      // Pagination
      expect(table.getPreviousPageButton()).toBeVisible();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).toBeVisible();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('renders without title disabled', () => {
      render(<TimeSeriesExplorer tableSettings={{ isTitleEnabled: false }} />);

      expect(screen.queryByText('Time series')).not.toBeInTheDocument();
      expect(screen.queryByText('(0)')).not.toBeInTheDocument();
    });

    it('renders with filter enabled', () => {
      render(<TimeSeriesExplorer tableSettings={{ isFilterEnabled: true }} />);

      expect(screen.getByLabelText('Filter')).toBeVisible();
    });

    it('renders with user settings enabled', () => {
      render(
        <TimeSeriesExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

      expect(screen.getByRole('button', { name: 'Preferences' })).toBeVisible();
    });

    it('renders a list of time series', async () => {
      const listTimeSeriesResponse = createListTimeSeriesPage(3);
      const timeSeries1 = {
        ...listTimeSeriesResponse.TimeSeriesSummaries[0],
        dataType: 'STRING',
      };
      const timeSeries2 = {
        ...listTimeSeriesResponse.TimeSeriesSummaries[1],
        dataType: 'DOUBLE',
      };
      const timeSeries3 = {
        ...listTimeSeriesResponse.TimeSeriesSummaries[2],
        dataType: 'INTEGER',
      };
      const listTimeSeries = jest.fn().mockResolvedValue({
        TimeSeriesSummaries: [timeSeries1, timeSeries2, timeSeries3],
      });
      render(
        <TimeSeriesExplorer
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries1.dataType)).toBeVisible();
      expect(screen.getByText(timeSeries2.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries2.dataType)).toBeVisible();
      expect(screen.getByText(timeSeries3.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries3.dataType)).toBeVisible();
    });

    it('renders expected columns', () => {
      render(<TimeSeriesExplorer />);

      expect(screen.getByText('ID')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();
      expect(screen.getByText('Alias')).toBeVisible();
      expect(screen.queryByText('Data type spec')).not.toBeInTheDocument();
      expect(screen.queryByText('Asset ID')).not.toBeInTheDocument();
      expect(screen.queryByText('Property ID')).not.toBeInTheDocument();
      expect(screen.queryByText('Latest value')).not.toBeInTheDocument();
      expect(screen.queryByText('Latest value time')).not.toBeInTheDocument();
    });

    it('renders expected columns when displaying latest values', () => {
      render(
        <TimeSeriesExplorer
          requestFns={{ batchGetAssetPropertyValue: jest.fn() }}
        />
      );

      expect(screen.getByText('ID')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();
      expect(screen.getByText('Latest value')).toBeVisible();
      expect(screen.getByText('Alias')).toBeVisible();
      expect(screen.getByText('Latest value time')).toBeVisible();
      expect(screen.queryByText('Data type spec')).not.toBeInTheDocument();
      expect(screen.queryByText('Asset ID')).not.toBeInTheDocument();
      expect(screen.queryByText('Property ID')).not.toBeInTheDocument();
    });
  });

  describe('requests', () => {
    it('requests a single page of time series correctly', async () => {
      const listTimeSeries = jest
        .fn()
        .mockResolvedValue(createListTimeSeriesPage(3));
      render(
        <TimeSeriesExplorer
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listTimeSeries).toHaveBeenCalledOnce();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeVisible();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).toBeVisible();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('requests multiple pages of time series correctly', async () => {
      const listTimeSeries = jest
        .fn()
        .mockResolvedValueOnce(createListTimeSeriesPage(10, 0, 'next-token'))
        .mockResolvedValueOnce(createListTimeSeriesPage(10, 10));
      render(
        <TimeSeriesExplorer
          defaultPageSize={10}
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listTimeSeries).toHaveBeenCalledOnce();
      expect(screen.getByText('(10)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listTimeSeries).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listTimeSeries).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listTimeSeries).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('requests multiple lists of pages of time series correctly', async () => {
      const listTimeSeries = jest
        .fn()
        .mockResolvedValueOnce(createListTimeSeriesPage(10, 0, 'next-token-1'))
        .mockResolvedValueOnce(createListTimeSeriesPage(5, 10))
        .mockResolvedValueOnce(createListTimeSeriesPage(5, 15, 'next-token-2'))
        .mockResolvedValueOnce(createListTimeSeriesPage(10, 20));
      render(
        <TimeSeriesExplorer
          defaultPageSize={10}
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id-1' }, { assetId: 'asset-id-2' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listTimeSeries).toHaveBeenCalledOnce();
      expect(screen.getByText('(10)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listTimeSeries).toHaveBeenCalledTimes(3);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listTimeSeries).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listTimeSeries).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listTimeSeries).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listTimeSeries).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();
    });
  });

  describe('latest values', () => {
    it('supports displaying the latest values of time series', async () => {
      const listTimeSeriesResponse = createListTimeSeriesPage(3);
      const {
        TimeSeriesSummaries: [timeSeries1, timeSeries2, timeSeries3],
      } = listTimeSeriesResponse;
      const listTimeSeries = jest
        .fn()
        .mockResolvedValue(listTimeSeriesResponse);
      const timeSeries1SuccessEntry = {
        // Entry ID constructure is an implementation detail
        entryId: timeSeries1.timeSeriesId,
        assetPropertyValue: {
          timestamp: {
            timeInSeconds: 100,
          },
          value: {
            stringValue: 'String Value',
          },
        },
      };
      const timeSeries2SuccessEntry = {
        entryId: timeSeries2.timeSeriesId,
        assetPropertyValue: {
          timestamp: {
            timeInSeconds: 200,
          },
          value: {
            integerValue: 40,
          },
        },
      };
      const timeSeries3SuccessEntry = {
        entryId: timeSeries3.timeSeriesId,
        assetPropertyValue: {
          timestamp: {
            timeInSeconds: 300,
          },
          value: {
            doubleValue: 35.5,
          },
        },
      };
      const batchGetAssetPropertyValue = jest.fn().mockResolvedValue({
        successEntries: [
          timeSeries1SuccessEntry,
          timeSeries2SuccessEntry,
          timeSeries3SuccessEntry,
        ],
        skippedEntries: [],
        errorEntries: [],
      } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>);
      render(
        <TimeSeriesExplorer
          requestFns={{
            batchGetAssetPropertyValue,
            listTimeSeries,
          }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(batchGetAssetPropertyValue).toHaveBeenCalledOnce();
      expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries2.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries3.timeSeriesId)).toBeVisible();
      expect(
        screen.getByText(
          timeSeries1SuccessEntry.assetPropertyValue.value.stringValue
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          timeSeries2SuccessEntry.assetPropertyValue.value.integerValue
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          timeSeries3SuccessEntry.assetPropertyValue.value.doubleValue
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          formatDate(
            timeSeries1SuccessEntry.assetPropertyValue.timestamp.timeInSeconds *
              1000
          )
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          formatDate(
            timeSeries2SuccessEntry.assetPropertyValue.timestamp.timeInSeconds *
              1000
          )
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          formatDate(
            timeSeries3SuccessEntry.assetPropertyValue.timestamp.timeInSeconds *
              1000
          )
        )
      ).toBeVisible();
    });

    it('regularly requests latest values', async () => {
      jest.useFakeTimers();
      const listTimeSeries = jest
        .fn()
        .mockResolvedValue(createListTimeSeriesPage(3));
      const batchGetAssetPropertyValue = jest.fn().mockResolvedValue({
        successEntries: [],
        skippedEntries: [],
        errorEntries: [],
      } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>);
      render(
        <TimeSeriesExplorer
          requestFns={{
            batchGetAssetPropertyValue,
            listTimeSeries,
          }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(batchGetAssetPropertyValue).toHaveBeenCalledOnce();

      jest.advanceTimersByTime(DEFAULT_LATEST_VALUE_REQUEST_INTERVAL);
      expect(batchGetAssetPropertyValue).toHaveBeenCalledTimes(2);

      // Remove mocking
      jest.useRealTimers();
    });
  });

  describe('selection', () => {
    it('does not allow selecting time series if selectionMode is undefined', async () => {
      const listTimeSeries = jest
        .fn()
        .mockResolvedValue(createListTimeSeriesPage(3));

      render(<SelectableTimeSeriesTable listTimeSeries={listTimeSeries} />);

      await table.waitForLoadingToFinish();

      expect(screen.queryAllByRole('radio')).toHaveLength(0);
      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    describe('single-select', () => {
      it('allows selecting a single time series', async () => {
        const listTimeSeries = jest
          .fn()
          .mockResolvedValue(createListTimeSeriesPage(3));
        const user = userEvent.setup();
        render(
          <SelectableTimeSeriesTable
            selectionMode='single'
            listTimeSeries={listTimeSeries}
          />
        );

        await table.waitForLoadingToFinish();

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
        const radios = screen.queryAllByRole('radio');
        expect(radios).toHaveLength(3);
        const [timeSeriesRadio1, timeSeriesRadio2, timeSeriesRadio3] = radios;

        expect(timeSeriesRadio1).not.toBeChecked();
        expect(timeSeriesRadio2).not.toBeChecked();
        expect(timeSeriesRadio3).not.toBeChecked();

        await user.click(timeSeriesRadio1);

        expect(timeSeriesRadio1).toBeChecked();
        expect(timeSeriesRadio2).not.toBeChecked();
        expect(timeSeriesRadio3).not.toBeChecked();

        await user.click(timeSeriesRadio2);

        expect(timeSeriesRadio1).not.toBeChecked();
        expect(timeSeriesRadio2).toBeChecked();
        expect(timeSeriesRadio3).not.toBeChecked();

        await user.click(timeSeriesRadio3);

        expect(timeSeriesRadio1).not.toBeChecked();
        expect(timeSeriesRadio2).not.toBeChecked();
        expect(timeSeriesRadio3).toBeChecked();
      });
    });

    describe('multi-select', () => {
      it('allows selecting multiple time series', async () => {
        const listTimeSeries = jest
          .fn()
          .mockResolvedValue(createListTimeSeriesPage(3));
        const user = userEvent.setup();
        render(
          <SelectableTimeSeriesTable
            selectionMode='multi'
            listTimeSeries={listTimeSeries}
          />
        );

        await table.waitForLoadingToFinish();

        expect(screen.queryAllByRole('radio')).toHaveLength(0);
        const checkboxes = screen.queryAllByRole('checkbox');
        expect(checkboxes).toHaveLength(4);
        const [
          allTimeSeriesCheckbox,
          timeSeriesCheckbox1,
          timeSeriesCheckbox2,
          timeSeriesCheckbox3,
        ] = checkboxes;

        expect(allTimeSeriesCheckbox).not.toBeChecked();
        expect(allTimeSeriesCheckbox).not.toBePartiallyChecked();
        expect(timeSeriesCheckbox1).not.toBeChecked();
        expect(timeSeriesCheckbox2).not.toBeChecked();
        expect(timeSeriesCheckbox3).not.toBeChecked();

        await user.click(timeSeriesCheckbox1);

        expect(allTimeSeriesCheckbox).not.toBeChecked();
        expect(allTimeSeriesCheckbox).toBePartiallyChecked();
        expect(timeSeriesCheckbox1).toBeChecked();
        expect(timeSeriesCheckbox2).not.toBeChecked();
        expect(timeSeriesCheckbox3).not.toBeChecked();

        await user.click(timeSeriesCheckbox2);

        expect(allTimeSeriesCheckbox).not.toBeChecked();
        expect(allTimeSeriesCheckbox).toBePartiallyChecked();
        expect(timeSeriesCheckbox1).toBeChecked();
        expect(timeSeriesCheckbox2).toBeChecked();
        expect(timeSeriesCheckbox3).not.toBeChecked();

        await user.click(timeSeriesCheckbox3);

        expect(allTimeSeriesCheckbox).toBeChecked();
        expect(allTimeSeriesCheckbox).not.toBePartiallyChecked();
        expect(timeSeriesCheckbox1).toBeChecked();
        expect(timeSeriesCheckbox2).toBeChecked();
        expect(timeSeriesCheckbox3).toBeChecked();

        await user.click(timeSeriesCheckbox1);

        expect(allTimeSeriesCheckbox).not.toBeChecked();
        expect(allTimeSeriesCheckbox).toBePartiallyChecked();
        expect(timeSeriesCheckbox1).not.toBeChecked();
        expect(timeSeriesCheckbox2).toBeChecked();
        expect(timeSeriesCheckbox3).toBeChecked();

        await user.click(timeSeriesCheckbox2);

        expect(allTimeSeriesCheckbox).not.toBeChecked();
        expect(allTimeSeriesCheckbox).toBePartiallyChecked();
        expect(timeSeriesCheckbox1).not.toBeChecked();
        expect(timeSeriesCheckbox2).not.toBeChecked();
        expect(timeSeriesCheckbox3).toBeChecked();

        await user.click(timeSeriesCheckbox3);

        expect(allTimeSeriesCheckbox).not.toBeChecked();
        expect(allTimeSeriesCheckbox).not.toBePartiallyChecked();
        expect(timeSeriesCheckbox1).not.toBeChecked();
        expect(timeSeriesCheckbox2).not.toBeChecked();
        expect(timeSeriesCheckbox3).not.toBeChecked();
      });
    });
  });

  describe('filtering', () => {
    it('supports filtering by property', async () => {
      const listTimeSeries = jest
        .fn()
        .mockResolvedValue(createListTimeSeriesPage(3));
      render(
        <TimeSeriesExplorer
          tableSettings={{ isFilterEnabled: true }}
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      await table.waitForLoadingToFinish();
      await table.openFilterControls();

      expect(screen.getByRole('option', { name: 'ID' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'Data type' })).toBeVisible();
      expect(
        screen.getByRole('option', { name: 'Data type spec' })
      ).toBeVisible();
      expect(screen.getByRole('option', { name: 'Alias' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'Asset ID' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'Property ID' })).toBeVisible();
    });

    it('supports filtering by text', async () => {
      const listTimeSeriesResponse = createListTimeSeriesPage(3);
      const timeSeries1 = {
        ...listTimeSeriesResponse.TimeSeriesSummaries[0],
        timeSeriesId: 'Similar Name 1',
      };
      const timeSeries2 = {
        ...listTimeSeriesResponse.TimeSeriesSummaries[1],
        timeSeriesId: 'Similar Name 2',
      };
      const timeSeries3 = {
        ...listTimeSeriesResponse.TimeSeriesSummaries[2],
        timeSeriesId: 'Different Name 3',
      };
      const listTimeSeries = jest.fn().mockResolvedValue({
        TimeSeriesSummaries: [timeSeries1, timeSeries2, timeSeries3],
      });
      const user = userEvent.setup();
      render(
        <TimeSeriesExplorer
          tableSettings={{ isFilterEnabled: true }}
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries2.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries3.timeSeriesId)).toBeVisible();

      await table.openFilterControls();
      await user.keyboard('Similar');
      await user.click(screen.getByText('Use: "Similar"'));

      expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries2.timeSeriesId)).toBeVisible();
      expect(
        screen.queryByText(timeSeries3.timeSeriesId)
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Clear filters' }));

      expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries2.timeSeriesId)).toBeVisible();
      expect(screen.getByText(timeSeries3.timeSeriesId)).toBeVisible();
    });
  });

  describe('user settings', () => {
    it('renders user settings as expected', async () => {
      const user = userEvent.setup();
      render(
        <TimeSeriesExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

      expect(screen.queryByText('Preferences')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Preferences' }));

      expect(screen.getByText('Preferences')).toBeVisible();
      expect(screen.getByText('Page size')).toBeVisible();
      expect(screen.getByText('Wrap lines')).toBeVisible();
      expect(screen.getByText('Striped rows')).toBeVisible();
      expect(screen.getByText('Compact mode')).toBeVisible();
      expect(screen.getByText('Sticky first columns')).toBeVisible();
      expect(screen.getByText('Sticky last columns')).toBeVisible();
      expect(screen.getByText('Column preferences')).toBeVisible();
    });

    it('renders expect column preferences', async () => {
      render(
        <TimeSeriesExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

      await table.openUserSettings();

      expect(table.getColumnDisplayCheckbox('ID')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('ID')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('ID')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Data type')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Data type')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Data type')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Alias')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Alias')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Alias')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Data type spec')).toBeVisible();
      expect(
        table.getColumnDisplayCheckbox('Data type spec')
      ).not.toBeChecked();
      expect(table.getColumnDisplayCheckbox('Data type spec')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Asset ID')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Asset ID')).not.toBeChecked();
      expect(table.getColumnDisplayCheckbox('Asset ID')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Property ID')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Property ID')).not.toBeChecked();
      expect(table.getColumnDisplayCheckbox('Property ID')).toBeEnabled();
      expect(
        table.queryColumnDisplayCheckbox('Latest value')
      ).not.toBeInTheDocument();
      expect(
        table.queryColumnDisplayCheckbox('Latest value time')
      ).not.toBeInTheDocument();
    });

    it('renders expect column preferences with latest values enabled', async () => {
      render(
        <TimeSeriesExplorer
          tableSettings={{ isUserSettingsEnabled: true }}
          requestFns={{ batchGetAssetPropertyValue: jest.fn() }}
        />
      );

      await table.openUserSettings();

      expect(table.getColumnDisplayCheckbox('Latest value')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Latest value')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Latest value')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Latest value time')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Latest value time')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Latest value time')).toBeEnabled();
    });

    it('supports users changing settings', async () => {
      const user = userEvent.setup();
      render(
        <TimeSeriesExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

      expect(screen.getByText('ID')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Data type'));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(screen.getByText('ID')).toBeVisible();
      expect(screen.queryByText('Data type')).not.toBeInTheDocument();
    });

    it('supports users cancelling changing settings', async () => {
      const user = userEvent.setup();
      render(
        <TimeSeriesExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

      expect(screen.getByText('ID')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Data type'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('ID')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Data type'));
      await user.click(screen.getByRole('button', { name: 'Close modal' }));

      expect(screen.getByText('ID')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();
    });
  });
});
