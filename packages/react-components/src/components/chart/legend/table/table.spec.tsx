import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { ChartLegendTable } from './table';
import { DataStreamInformation, TrendCursor } from './types';
import { useChartStore } from '../../store';

const setupStore = () => {
  renderHook(() => useChartStore((state) => state.unHighlightDataStream));
  renderHook(() => useChartStore((state) => state.highlightedDataStreams));
  renderHook(() => useChartStore((state) => state.highlightDataStream));

  renderHook(() => useChartStore((state) => state.unHideDataStream));
  renderHook(() => useChartStore((state) => state.hiddenDataStreams));
  renderHook(() => useChartStore((state) => state.hideDataStream));
};

describe('legend table', () => {
  beforeEach(setupStore);

  it('correctly renders datastreams', () => {
    const datastreams: DataStreamInformation[] = [
      {
        id: 'datastream-1',
        name: 'fake datastream',
        color: 'black',
        trendCursorValues: {},
        latestValue: 111,
      },
      {
        id: 'datastream-2',
        name: 'fake datastream 2',
        color: 'black',
        trendCursorValues: {},
        latestValue: 222,
      },
    ];
    const table = render(
      <ChartLegendTable
        visible={true}
        datastreams={datastreams}
        trendCursors={[]}
        significantDigits={2}
      />
    );

    expect(table).not.toBeNull();
    expect(screen.getByText('fake datastream')).not.toBeNull();
    expect(screen.getByText('fake datastream 2')).not.toBeNull();
  });

  it('correctly renders trendcursors', () => {
    const datastreams: DataStreamInformation[] = [
      {
        id: 'datastream-1',
        name: 'fake datastream',
        color: 'black',
        trendCursorValues: {
          'trendcursor-1': 111,
          'trendcursor-2': 333,
        },
        latestValue: 111,
      },
    ];
    const trendCursors: TrendCursor[] = [
      {
        id: 'trendcursor-1',
        date: 1705433860094,
        color: 'black',
      },
      {
        id: 'trendcursor-2',
        date: 1705433882789,
        color: 'green',
      },
    ];
    const table = render(
      <ChartLegendTable
        visible={true}
        datastreams={datastreams}
        trendCursors={trendCursors}
        significantDigits={2}
      />
    );

    expect(table).not.toBeNull();
    expect(
      screen.getByText(new Date(trendCursors[0].date).toLocaleTimeString())
    ).not.toBeNull();
    expect(
      screen.getByText(new Date(trendCursors[1].date).toLocaleTimeString())
    ).not.toBeNull();

    expect(screen.getByText('111')).not.toBeNull();
    expect(screen.getByText('333')).not.toBeNull();
  });
});
