import { describe, expect } from '@jest/globals';
import handleSync from '../utils/handleSync';
import { mockSeries, mockSize, mockViewportInMs } from './getTrendCursor.spec';
import { renderHook } from '@testing-library/react';
import useDataStore from '../../../store';
import { useECharts } from '../../../hooks/useECharts';
import { InternalGraphicComponentGroupOption } from '../types';
import { DEFAULT_CHART_VISUALIZATION } from '../eChartsConstants';
describe('handleSync', () => {
  const setGraphicStub = jest.fn();
  const useSyncProps = {
    isInSyncMode: true,
    graphic: [],
    series: mockSeries,
    setGraphic: setGraphicStub,
    viewportInMs: mockViewportInMs,
    yMax: 30,
    yMin: 0,
    size: mockSize,
    groupId: 'group1',
    visualization: DEFAULT_CHART_VISUALIZATION,
  };

  it('set state should not be called when there are no changes ', () => {
    const { result } = renderHook(() => useECharts('dark'));

    renderHook(() =>
      handleSync({
        chartRef: result.current.chartRef,
        ...useSyncProps,
      })
    );

    expect(setGraphicStub).not.toBeCalled();
  });

  it('set state should be called with new TC ', async () => {
    useDataStore.setState({
      trendCursorGroups: {
        group1: {
          'trendCursor-1': {
            timestamp: Date.now(),
            tcHeaderColorIndex: 0,
          },
        },
      },
    });
    const { result } = renderHook(() => useECharts('dark'));

    renderHook(() =>
      handleSync({
        chartRef: result.current.chartRef,
        ...useSyncProps,
      })
    );

    expect(setGraphicStub).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'trendCursor-1',
        }),
      ])
    );
  });

  it('set state should be called with updated TC ', async () => {
    const newTime = Date.now() - 1000;
    useDataStore.setState({
      trendCursorGroups: {
        group1: {
          'trendCursor-1': {
            timestamp: newTime,
            tcHeaderColorIndex: 0,
          },
        },
      },
    });
    const { result } = renderHook(() => useECharts('dark'));

    renderHook(() =>
      handleSync({
        chartRef: result.current.chartRef,
        ...useSyncProps,
        graphic: [
          {
            id: 'trendCursor-1',
            timestampInMs: Date.now() - 500,
            children: [{}, {}, {}, {}],
          } as InternalGraphicComponentGroupOption,
        ],
      })
    );

    expect(setGraphicStub).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'trendCursor-1',
          timestampInMs: newTime,
        }),
      ])
    );
  });

  it('set state should be called with Deleted TC ', async () => {
    useDataStore.setState({
      trendCursorGroups: {
        group1: {},
      },
    });
    const { result } = renderHook(() => useECharts('dark'));

    renderHook(() =>
      handleSync({
        chartRef: result.current.chartRef,
        ...useSyncProps,
        graphic: [
          {
            id: 'trendCursor-1',
            timestampInMs: Date.now() - 500,
            children: [{}, {}, {}, {}],
          } as InternalGraphicComponentGroupOption,
        ],
      })
    );

    expect(setGraphicStub).toBeCalledWith([]);
  });
});
