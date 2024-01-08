import { DataStream } from '@iot-app-kit/core';
import { render, renderHook, getByText } from '@testing-library/react';
import { SeriesOption } from 'echarts';
import useChartsLegend from './useChartsLegend';
import React from 'react';
import { useChartStore } from '../store';

const DATA_STREAM: DataStream = {
  id: 'abc-1',
  data: [
    { x: 1, y: 0 },
    { x: 2, y: 1 },
  ],
  resolution: 0,
  name: 'Average Wind Speed',
};

const mockSeries = [
  {
    id: 'abc-1',
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
      opacity: 1,
    },
    lineStyle: {
      color: '#2ea597',
      type: 'solid',
      width: 2,
      opacity: 1,
    },
    yAxisIndex: 0,
  },
] as SeriesOption[];

const setupStore = () => {
  renderHook(() => useChartStore((state) => state.unHighlightDataStream));
  renderHook(() => useChartStore((state) => state.highlightedDataStreams));
  renderHook(() => useChartStore((state) => state.highlightDataStream));

  renderHook(() => useChartStore((state) => state.unHideDataStream));
  renderHook(() => useChartStore((state) => state.hiddenDataStreams));
  renderHook(() => useChartStore((state) => state.hideDataStream));
};

describe('useChartsLegend sets correct items', () => {
  beforeEach(setupStore);

  it('populates Legend Cell correctly', () => {
    const { result: chart } = renderHook(() =>
      useChartsLegend({
        datastreams: [DATA_STREAM],
        series: mockSeries,
        width: 100,
        graphic: [],
      })
    );
    expect(chart.current.items).toStrictEqual([
      {
        name: 'Average Wind Speed',
        lineColor: '#2ea597',
        datastream: {
          id: 'abc-1',
          data: [
            { x: 1, y: 0 },
            { x: 2, y: 1 },
          ],
          resolution: 0,
          name: 'Average Wind Speed',
        },
        width: 100,
        tc: {},
      },
    ]);
  });

  it('populates column definitions correctly', () => {
    const { result: chartData } = renderHook(() =>
      useChartsLegend({
        datastreams: [DATA_STREAM],
        series: mockSeries,
        width: 100,
        graphic: [],
      })
    );
    const e = {
      name: 'Average Wind Speed',
      lineColor: '#2ea597',
      datastream: {
        id: 'abc-1',
        data: [
          { x: 1, y: 0 },
          { x: 2, y: 1 },
        ],
        resolution: 0,
        name: 'Average Wind Speed',
      },
      width: 100,
    };
    chartData.current.columnDefinitions.forEach((def) => {
      const container = render(<>{def.cell(e)}</>).baseElement;
      expect(getByText(container, e.name)).toBeTruthy();
    });
  });
});
