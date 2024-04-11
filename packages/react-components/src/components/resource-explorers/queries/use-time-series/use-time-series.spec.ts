import {
  testUseListResourcesHook,
  createFakeTimeSeriesSummary,
} from '../helpers/testing';
import { useTimeSeries } from './use-time-series';

testUseListResourcesHook({
  resourceName: 'timeSeries',
  hook: useTimeSeries,
  renderHookWithEmptyList() {
    const fakeListTimeSeries = jest
      .fn()
      .mockResolvedValueOnce({ TimeSeriesSummaries: [] });

    return {
      resourceHookOptions: {
        queries: [{ assetId: '123' }],
        maxResults: 5,
        listTimeSeries: fakeListTimeSeries,
      },
    };
  },
  renderHookWithSinglePage() {
    const fakeListTimeSeriesResponse = {
      TimeSeriesSummaries: [
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
      ],
    };
    const fakeListTimeSeries = jest
      .fn()
      .mockResolvedValue(fakeListTimeSeriesResponse);

    return {
      resourceHookOptions: {
        queries: [{ assetId: '123' }],
        maxResults: 5,
        listTimeSeries: fakeListTimeSeries,
      },
      expectedResources: fakeListTimeSeriesResponse.TimeSeriesSummaries,
    };
  },
  renderHookWithMultiplePages() {
    const page1 = {
      TimeSeriesSummaries: [
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
      ],
    };
    const page2 = {
      TimeSeriesSummaries: [
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
      ],
      nextToken: 'token-1',
    };
    const page3 = {
      TimeSeriesSummaries: [
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
      ],
      nextToken: 'token-2',
    };
    const page4 = {
      TimeSeriesSummaries: [
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
        createFakeTimeSeriesSummary(),
      ],
    };
    const fakeListTimeSeries = jest
      .fn()
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2)
      .mockResolvedValueOnce(page3)
      .mockResolvedValue(page4);

    return {
      resourceHookOptions: {
        queries: [{ assetId: '123' }, { assetId: '456' }],
        maxResults: 5,
        listTimeSeries: fakeListTimeSeries,
      },
      expectedResourcesPage1: [
        ...page1.TimeSeriesSummaries,
        ...page2.TimeSeriesSummaries,
      ],
      expectedResourcesPage2: page3.TimeSeriesSummaries,
      expectedResourcesPage3: page4.TimeSeriesSummaries,
    };
  },

  renderHookWithError() {
    const fakeListTimeSeries = jest.fn().mockRejectedValue(new Error('Error'));

    return {
      resourceHookOptions: {
        queries: [{ assetId: '123' }],
        maxResults: 5,
        listTimeSeries: fakeListTimeSeries,
      },
    };
  },
});
