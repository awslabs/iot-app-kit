import { describe, expect } from '@jest/globals';
import { SeriesOption } from 'echarts';
import { calculateXFromTimestamp } from '../calculations/calculations';
import { createRef } from 'react';
import { renderHook } from '@testing-library/react';
import { useECharts } from '../../../../hooks/useECharts';
import { DEFAULT_CHART_VISUALIZATION } from '../../eChartsConstants';

import { addTCMarkers } from '../getTrendCursor/components/markers';
import { addTCLine } from '../getTrendCursor/components/line';
import { addTCHeader } from '../getTrendCursor/components/header';
import { addTCDeleteButton } from '../getTrendCursor/components/deleteButton';
import { onDragUpdateTrendCursor } from '../mouseEvents/handlers/drag/update';
import { convertViewportToMs } from '../calculations/viewport';
import { calculateSeriesMakers } from '../calculations/calculateSeriesMakers';

export const mockSeries = [
  {
    name: 'Average Wind Speed',
    data: [
      [1689264600000, 22.939564631713747],
      [1689264900000, 24.054178935438895],
      [1689265200000, 20.840328700172748],
      [1689265500000, 17.627425014582514],
      [1689265800000, 17.521569204159785],
    ],
    type: 'line',
    step: false,
    symbol: 'circle',
    symbolSize: 4,
    itemStyle: {
      color: '#2ea597',
    },
    lineStyle: {
      color: '#2ea597',
      type: 'solid',
      width: 2,
    },
    yAxisIndex: 0,
  },
] as SeriesOption[];

export const mockViewport = {
  start: new Date('2023-07-13T16:00:00.000Z'),
  end: new Date('2023-07-13T16:30:00.000Z'),
};

export const mockGraphic = {
  id: 'trendCursor-b07ad559-2c02-4d03-9d67-9a45fb25111b',
  $action: 'merge',
  type: 'group' as const,
  timestampInMs: 0,
  yAxisMarkerValue: [22.9396],
  x: 50,
  children: [
    {
      type: 'line' as const,
      z: 100,
      id: 'line-b07ad559-2c02-4d03-9d67-9a45fb25111b',
      draggable: 'horizontal',
    },
    {
      type: 'text' as const,
      z: 101,
      id: 'text-b07ad559-2c02-4d03-9d67-9a45fb25111b',
      silent: true,
    },
    {
      id: 'polyline-b07ad559-2c02-4d03-9d67-9a45fb25111b',
      type: 'polyline' as const,
      z: 101,
      x: 45,
      y: 31,
    },
    {
      id: 'circle-0-b07ad559-2c02-4d03-9d67-9a45fb25111b',
      type: 'circle' as const,
      z: 101,
      y: 0,
    },
  ],
};
export const mockViewportInMs = convertViewportToMs(mockViewport);
export const mockSize = { width: 500, height: 500 };
export const mockRef = createRef<HTMLDivElement>();
describe('Testing getNewTrendCursor file', () => {
  describe('ondragUpdateTrendCursor', () => {
    it('should update timestamp on drag', () => {
      const { result } = renderHook(() => useECharts('dark'));
      const newTrendCursor = mockGraphic;
      const timestamp = Date.parse('2023-07-13T16:00:00.000Z') + 1000 * 60 * 60 * 2; // 1689271200000

      onDragUpdateTrendCursor({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        graphic: newTrendCursor,
        posX: calculateXFromTimestamp(timestamp, result.current.chartRef),
        timeInMs: timestamp,
        series: mockSeries,
        size: mockSize,
        chartRef: result.current.chartRef,
        visualization: DEFAULT_CHART_VISUALIZATION,
      });
      expect(newTrendCursor).not.toBeNull();
      expect(newTrendCursor?.timestampInMs).toBe(1689271200000);
    });
  });

  describe('Test adding new elements', () => {
    it('addTCLine', () => {
      const newTCLine = addTCLine('ID', { width: 100, height: 100 });
      expect(newTCLine.id).toBe('line-ID');
    });
    it('addTCHeader', () => {
      const newTTCHeader = addTCHeader('ID', 0);
      expect(newTTCHeader.id).toBe('header-ID');
    });
    it('addTCDeleteButton', () => {
      const newTCDeleteButton = addTCDeleteButton('ID');
      expect(newTCDeleteButton.id).toBe('delete-button-ID');
    });
    it('addTCMarkers', () => {
      const newTCMarker = addTCMarkers('ID', [200], []);
      expect(newTCMarker[0].id).toBe('circle-0-ID');
    });
  });

  describe('testing markers calculations, calculateTrendCursorsSeriesMakers', () => {
    it('calculateTrendCursorsSeriesMakers should populate the required values', () => {
      const { result } = renderHook(() => useECharts('dark'));
      const { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue } = calculateSeriesMakers(
        mockSeries,
        1689264600000,
        result.current.chartRef,
        'line'
      );
      expect(trendCursorsSeriesMakersInPixels.length > 0).toBeTruthy();
      expect(trendCursorsSeriesMakersValue.length > 0).toBeTruthy();
    });
  });
});
