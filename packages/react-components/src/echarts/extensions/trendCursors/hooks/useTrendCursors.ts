import { useEffect } from 'react';
import useDataStore from '../../../../store';
import { Updater, TrendCursorGroupId, onConnect, onDisconnect } from '../store';
import { ChartRef } from '../../../../hooks/useECharts';
import { ElementEvent } from 'echarts';
import { useThrottledTrendCursorValues } from './useThrottledTrendCursorValues';
import { useTrendCursorActions } from './useTrendCursorActions';

export const useTrendCursors = ({
  group,
  chartRef,
  id,
}: {
  id?: string;
  group: TrendCursorGroupId;
  chartRef: ChartRef;
}) => {
  const {
    trendCursors: throttledTrendCursors,
    trendCursorValues: throttledTrendCursorValues,
  } = useThrottledTrendCursorValues({ group, chartId: id });

  const { handleAddTrendCursor, ...otherActions } = useTrendCursorActions({
    id,
    group,
    chartRef,
  });

  const dispatch = useDataStore((state) => state.trendCursorsDispatch);

  useEffect(() => {
    const chart = chartRef.current;
    let frame: number;
    const updater: Updater = (trendCursors, action) => {
      // echarts doesn't want this called in the main loop
      frame = requestAnimationFrame(() => {
        const settings =
          action === 'update' ? undefined : { replaceMerge: ['trendCursors'] };
        chart?.setOption({ trendCursors }, settings);
      });
    };

    dispatch(onConnect(group, updater));

    const handleClickAddTrendCursor = (e: ElementEvent) => {
      if (e.event.shiftKey) {
        handleAddTrendCursor(e.offsetX);
      }
    };
    chart?.getZr().on('click', handleClickAddTrendCursor);

    return () => {
      cancelAnimationFrame(frame);

      dispatch(onDisconnect(group, updater));

      chart?.getZr()?.off('click', handleClickAddTrendCursor);
    };
  }, [dispatch, group, chartRef, handleAddTrendCursor]);

  return {
    handleAddTrendCursor,
    ...otherActions,
    trendCursors: throttledTrendCursors,
    trendCursorValues: throttledTrendCursorValues,
  };
};
