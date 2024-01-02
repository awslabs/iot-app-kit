import { useCallback } from 'react';
import { getPlugin } from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';
import {
  addTrendCursor,
  copyNearestTrendCursor,
  removeNearestTrendCursor,
} from '../echartsActions';
import { ElementEvent } from 'echarts';
import { useTrendCursorColorer } from './useTrendCursorColorer';
import { ChartRef } from '../../../../hooks/useECharts';
import { TrendCursorGroupId } from '../store';

export const useTrendCursorActions = ({
  group,
  chartRef,
  id,
}: {
  id?: string;
  group: TrendCursorGroupId;
  chartRef: ChartRef;
}) => {
  const colorer = useTrendCursorColorer(group);

  const handleAddTrendCursor = useCallback(
    (offsetX: number) => {
      const metricsRecorder = getPlugin('metricsRecorder');
      metricsRecorder?.record({
        metricName: 'TrendCursorAdd',
        metricValue: 1,
      });

      const action = addTrendCursor(
        { offsetX } as ElementEvent,
        { group, id: uuid(), color: colorer.current.next() },
        id
      );
      chartRef.current?.dispatchAction(action);
    },
    [chartRef, group, id, colorer]
  );

  const handleDeleteTrendCursor = useCallback(
    (offsetX: number) => {
      const metricsRecorder = getPlugin('metricsRecorder');
      metricsRecorder?.record({
        metricName: 'TrendCursorDelete',
        metricValue: 1,
      });

      const action = removeNearestTrendCursor({ offsetX } as ElementEvent, id);
      chartRef.current?.dispatchAction(action);
    },
    [chartRef, id]
  );

  const handleCopyTrendCursor = useCallback(
    (offsetX: number) => {
      const metricsRecorder = getPlugin('metricsRecorder');
      metricsRecorder?.record({
        metricName: 'TrendCursorCopy',
        metricValue: 1,
      });

      const action = copyNearestTrendCursor({ offsetX } as ElementEvent, id);
      chartRef.current?.dispatchAction(action);
    },
    [chartRef, id]
  );

  return {
    handleAddTrendCursor,
    handleDeleteTrendCursor,
    handleCopyTrendCursor,
  };
};
