import { describe, expect } from '@jest/globals';
import { ElementEvent, SeriesOption } from 'echarts';
import { getNewTrendCursor, onDragUpdateTrendCursor } from '../utils/getTrendCursor';
import { calculateXFromTimestamp, convertViewportToMs } from '../utils/getInfo';
import { createRef } from 'react';

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
export const mockViewportInMs = convertViewportToMs(mockViewport);
export const mockSize = { width: 500, height: 500 };
export const mockRef = createRef<HTMLDivElement>();
describe('Testing getNewTrendCursor file', () => {
  describe('getNewTrendCursor', () => {
    const mockSize = { width: 500, height: 500 };

    it('should add a new TC', () => {
      const mockEvent = {} as ElementEvent;
      const newTrendCursor = getNewTrendCursor({
        e: mockEvent,
        size: mockSize,
        tcHeaderColorIndex: 0,
        series: mockSeries,
        viewportInMs: mockViewportInMs,
        ref: mockRef,
      });

      expect(newTrendCursor).not.toBeNull();
      expect(newTrendCursor.children.length).toBe(4);
    });
  });

  describe('ondragUpdateTrendCursor', () => {
    it('should update timestamp on drag', () => {
      const mockEvent = {} as ElementEvent;
      const newTrendCursor = getNewTrendCursor({
        e: mockEvent,
        size: mockSize,
        tcHeaderColorIndex: 0,
        series: mockSeries,
        viewportInMs: mockViewportInMs,
        ref: mockRef,
      });

      const timestamp = Date.parse('2023-07-13T16:00:00.000Z') + 1000 * 60 * 60 * 2; // 1689271200000

      onDragUpdateTrendCursor({
        graphic: newTrendCursor,
        posX: calculateXFromTimestamp(timestamp, mockSize, mockViewportInMs),
        timeInMs: timestamp,
        series: mockSeries,
        size: mockSize,
        ref: mockRef,
      });
      expect(newTrendCursor).not.toBeNull();
      expect(newTrendCursor.timestampInMs).toBe(1689271200000);
    });
  });
});
