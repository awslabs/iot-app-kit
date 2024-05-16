import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';

import * as dropDown from '../helpers/drop-down';
import { createListTimeSeriesPage } from '../helpers/responses';
import { TimeSeriesExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../resource-explorer-query-client';
import type { SelectionMode } from '../../types/common';
import type { ListTimeSeries } from '../../types/request-fn';
import type { TimeSeriesResource } from '../../types/resources';
import type { TimeSeriesParameters } from '../../explorers/time-series-explorer/types';

function SelectableTimeSeriesDropDown({
  selectionMode,
  listTimeSeries,
  parameters,
}: {
  selectionMode?: SelectionMode;
  listTimeSeries: ListTimeSeries;
  parameters: TimeSeriesParameters;
}) {
  const [selectedTimeSeries, setSelectedTimeSeries] = useState<
    TimeSeriesResource[]
  >([]);

  return (
    <TimeSeriesExplorer
      variant='drop-down'
      requestFns={{ listTimeSeries }}
      selectionMode={selectionMode}
      selectedTimeSeries={selectedTimeSeries}
      onSelectTimeSeries={setSelectedTimeSeries}
      parameters={parameters}
    />
  );
}

describe('time series drop-down', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describe('rendering', () => {
    it('renders a drop-down without configuration', async () => {
      render(<TimeSeriesExplorer variant='drop-down' />);

      expect(screen.getByText('Select time series')).toBeVisible();

      await dropDown.open();

      expect(screen.getByText('No time series.')).toBeVisible();
    });

    it('renders a multi-select drop-down without configuration', async () => {
      render(<TimeSeriesExplorer variant='drop-down' selectionMode='multi' />);

      expect(screen.getByText('Select time series')).toBeVisible();

      await dropDown.open();

      expect(screen.getByText('No time series.')).toBeVisible();
    });

    it('renders drop-down options', async () => {
      const {
        TimeSeriesSummaries: [timeSeries1, timeSeries2],
      } = createListTimeSeriesPage(2);
      const {
        TimeSeriesSummaries: [timeSeries3],
      } = createListTimeSeriesPage(1, 2);
      const timeSeries3WithAlias = {
        ...timeSeries3,
        alias: 'time-series-alias',
      };
      const listTimeSeries = jest.fn().mockResolvedValue({
        TimeSeriesSummaries: [timeSeries1, timeSeries2, timeSeries3WithAlias],
      });
      render(
        <TimeSeriesExplorer
          variant='drop-down'
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      expect(
        dropDown.queryOption(timeSeries1.timeSeriesId)
      ).not.toBeInTheDocument();
      expect(
        dropDown.queryOption(timeSeries2.timeSeriesId)
      ).not.toBeInTheDocument();
      expect(
        dropDown.queryOption(timeSeries3WithAlias.alias)
      ).not.toBeInTheDocument();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      const timeSeriesOption1 = dropDown.getOption(timeSeries1.timeSeriesId);
      const timeSeriesOption2 = dropDown.getOption(timeSeries2.timeSeriesId);
      const timeSeriesOption3 = dropDown.getOption(timeSeries3WithAlias.alias);

      expect(timeSeriesOption1).toBeVisible();
      expect(timeSeriesOption1).toHaveTextContent(timeSeries1.timeSeriesId);
      expect(timeSeriesOption2).toBeVisible();
      expect(timeSeriesOption2).toHaveTextContent(timeSeries2.timeSeriesId);
      expect(timeSeriesOption3).toBeVisible();
      expect(timeSeriesOption3).toHaveTextContent(timeSeries3WithAlias.alias);
    });
  });

  describe('request handling', () => {
    it('requests a single page of time series correctly', async () => {
      const listTimeSeries = jest
        .fn()
        .mockResolvedValue(createListTimeSeriesPage(3));
      render(
        <TimeSeriesExplorer
          variant='drop-down'
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      // Page is requested without opening the drop-down
      expect(listTimeSeries).toHaveBeenCalledOnce();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();
    });

    it('requests multiple pages of time series correctly', async () => {
      const listTimeSeries = jest
        .fn()
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 0, 'next-token-1'))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 10, 'next-token-2'))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 20));
      render(
        <TimeSeriesExplorer
          variant='drop-down'
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      // First page is requested without opening the drop-down
      expect(listTimeSeries).toHaveBeenCalledOnce();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      // The rest of the pages are requested after opening the drop-down
      expect(listTimeSeries).toHaveBeenCalledTimes(3);
    });

    it('requests multiple lists of pages of time series correctly', async () => {
      const listTimeSeries = jest
        .fn()
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 0, 'next-token-1'))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 10))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 20, 'next-token-2'))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 30))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 40, 'next-token-3'))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 50))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 60, 'next-token-4'))
        .mockResolvedValueOnce(createListTimeSeriesPage(1, 70));

      render(
        <TimeSeriesExplorer
          variant='drop-down'
          requestFns={{ listTimeSeries }}
          parameters={[
            { assetId: 'asset-id-1' },
            { assetId: 'asset-id-2' },
            { assetId: 'asset-id-3' },
            { assetId: 'asset-id-4' },
          ]}
        />
      );

      expect(listTimeSeries).toHaveBeenCalledOnce();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      expect(listTimeSeries).toHaveBeenCalledTimes(8);
    });
  });

  describe('selection', () => {
    it('does not allow selecting time series if selectionMode is undefined', async () => {
      const listTimeSeriesResponse = createListTimeSeriesPage(3);
      const {
        TimeSeriesSummaries: [timeSeries1, timeSeries2, timeSeries3],
      } = listTimeSeriesResponse;
      const listTimeSeries = jest
        .fn()
        .mockResolvedValue(listTimeSeriesResponse);
      const user = userEvent.setup();
      render(
        <SelectableTimeSeriesDropDown
          listTimeSeries={listTimeSeries}
          parameters={[{ assetId: 'asset-id' }]}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();
      await user.click(dropDown.getOption(timeSeries1.timeSeriesId));

      expect(
        screen.queryByText(timeSeries1.timeSeriesId)
      ).not.toBeInTheDocument();
      expect(
        dropDown.queryOption(timeSeries1.timeSeriesId)
      ).not.toBeInTheDocument();
      expect(
        dropDown.queryOption(timeSeries2.timeSeriesId)
      ).not.toBeInTheDocument();
      expect(
        dropDown.queryOption(timeSeries3.timeSeriesId)
      ).not.toBeInTheDocument();
    });

    describe('single-select', () => {
      it('allows selecting a single time series', async () => {
        const listTimeSeriesResponse = createListTimeSeriesPage(3);
        const {
          TimeSeriesSummaries: [timeSeries1, timeSeries2, timeSeries3],
        } = listTimeSeriesResponse;
        const listTimeSeries = jest
          .fn()
          .mockResolvedValue(listTimeSeriesResponse);
        const user = userEvent.setup();

        render(
          <SelectableTimeSeriesDropDown
            selectionMode='single'
            listTimeSeries={listTimeSeries}
            parameters={[{ assetId: 'asset-id' }]}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(timeSeries1.timeSeriesId));

        expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
        expect(
          dropDown.queryOption(timeSeries1.timeSeriesId)
        ).not.toBeInTheDocument();
        expect(
          dropDown.queryOption(timeSeries2.timeSeriesId)
        ).not.toBeInTheDocument();
        expect(
          dropDown.queryOption(timeSeries3.timeSeriesId)
        ).not.toBeInTheDocument();
      });

      it('replaces the selection when a new selection is made', async () => {
        const listTimeSeriesResponse = createListTimeSeriesPage(2);
        const {
          TimeSeriesSummaries: [timeSeries1, timeSeries2],
        } = listTimeSeriesResponse;
        const listTimeSeries = jest
          .fn()
          .mockResolvedValue(listTimeSeriesResponse);
        const user = userEvent.setup();

        render(
          <SelectableTimeSeriesDropDown
            selectionMode='single'
            listTimeSeries={listTimeSeries}
            parameters={[{ assetId: 'asset-id' }]}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(timeSeries1.timeSeriesId));

        expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();

        await user.click(screen.getByText(timeSeries1.timeSeriesId));
        await user.click(dropDown.getOption(timeSeries2.timeSeriesId));

        expect(screen.getByText(timeSeries2.timeSeriesId)).toBeVisible();
        expect(
          screen.queryByText(timeSeries1.timeSeriesId)
        ).not.toBeInTheDocument();
      });
    });

    describe('multi-select', () => {
      it('allows selecting multiple time series', async () => {
        const listTimeSeriesResponse = createListTimeSeriesPage(3);
        const {
          TimeSeriesSummaries: [timeSeries1, timeSeries2, timeSeries3],
        } = listTimeSeriesResponse;
        const listTimeSeries = jest
          .fn()
          .mockResolvedValue(listTimeSeriesResponse);
        const user = userEvent.setup();
        render(
          <SelectableTimeSeriesDropDown
            selectionMode='multi'
            listTimeSeries={listTimeSeries}
            parameters={[{ assetId: 'asset-id' }]}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(timeSeries1.timeSeriesId));
        await user.click(dropDown.getOption(timeSeries2.timeSeriesId));
        await dropDown.close();

        expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
        expect(screen.getByText(timeSeries2.timeSeriesId)).toBeVisible();
        expect(
          dropDown.queryOption(timeSeries1.timeSeriesId)
        ).not.toBeInTheDocument();
        expect(
          dropDown.queryOption(timeSeries2.timeSeriesId)
        ).not.toBeInTheDocument();
        expect(
          dropDown.queryOption(timeSeries3.timeSeriesId)
        ).not.toBeInTheDocument();
      });

      it('allows for de-selecting time series', async () => {
        const listTimeSeriesResponse = createListTimeSeriesPage(2);
        const {
          TimeSeriesSummaries: [timeSeries1, timeSeries2],
        } = listTimeSeriesResponse;
        const listTimeSeries = jest
          .fn()
          .mockResolvedValue(listTimeSeriesResponse);
        const user = userEvent.setup();
        render(
          <SelectableTimeSeriesDropDown
            selectionMode='multi'
            listTimeSeries={listTimeSeries}
            parameters={[{ assetId: 'asset-id' }]}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(timeSeries1.timeSeriesId));
        await user.click(dropDown.getOption(timeSeries2.timeSeriesId));
        await dropDown.close();

        expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
        expect(screen.getByText(timeSeries2.timeSeriesId)).toBeVisible();

        await user.click(
          screen.getByRole('button', {
            name: `Remove ${timeSeries2.timeSeriesId}`,
          })
        );

        expect(screen.getByText(timeSeries1.timeSeriesId)).toBeVisible();
        expect(
          screen.queryByText(timeSeries2.timeSeriesId)
        ).not.toBeInTheDocument();

        await user.click(
          screen.getByRole('button', {
            name: `Remove ${timeSeries1.timeSeriesId}`,
          })
        );

        expect(
          screen.queryByText(timeSeries1.timeSeriesId)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('filtering', () => {
    it('filters time series', async () => {
      const timeSeries1 = {
        timeSeriesId: 'similar-time-series-id-1',
      };
      const timeSeries2 = {
        timeSeriesId: 'does-not-matter-because-alias-2',
        alias: 'similar-time-series-alias-2',
      };
      const timeSeries3 = {
        timeSeriesId: 'different-time-series-id-3',
      };
      const listTimeSeries = jest.fn().mockResolvedValue({
        TimeSeriesSummaries: [timeSeries1, timeSeries2, timeSeries3],
      });
      const user = userEvent.setup();
      render(
        <TimeSeriesExplorer
          variant='drop-down'
          requestFns={{ listTimeSeries }}
          parameters={[{ assetId: 'asset-id' }]}
          dropDownSettings={{
            isFilterEnabled: true,
          }}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      expect(screen.getByPlaceholderText('Filter time series')).toBeVisible();

      expect(dropDown.getOption(timeSeries1.timeSeriesId)).toBeVisible();
      expect(dropDown.getOption(timeSeries2.alias)).toBeVisible();
      expect(dropDown.getOption(timeSeries3.timeSeriesId)).toBeVisible();

      await user.keyboard('similar');

      expect(dropDown.getOption(timeSeries1.timeSeriesId)).toBeVisible();
      expect(dropDown.getOption(timeSeries2.alias)).toBeVisible();
      expect(
        dropDown.queryOption(timeSeries3.timeSeriesId)
      ).not.toBeInTheDocument();
      expect(screen.getByText('(2/3) time series matched')).toBeVisible();

      await dropDown.clearFilter();

      expect(dropDown.getOption(timeSeries1.timeSeriesId)).toBeVisible();
      expect(dropDown.getOption(timeSeries2.alias)).toBeVisible();
      expect(dropDown.getOption(timeSeries3.timeSeriesId)).toBeVisible();

      await user.keyboard('different');

      expect(
        dropDown.queryOption(timeSeries1.timeSeriesId)
      ).not.toBeInTheDocument();
      expect(dropDown.queryOption(timeSeries2.alias)).not.toBeInTheDocument();
      expect(dropDown.getOption(timeSeries3.timeSeriesId)).toBeVisible();
      expect(screen.getByText('(1/3) time series matched')).toBeVisible();
    });
  });
});
