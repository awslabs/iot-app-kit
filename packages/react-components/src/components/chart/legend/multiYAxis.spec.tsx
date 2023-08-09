import React from 'react';
import { DataStream } from '@iot-app-kit/core';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { MultiYAxisLegend } from './multiYAxis';
import { act } from 'react-dom/test-utils';
import { useChartStore } from '../store';
import { isDataStreamInList } from '../../../utils/isDataStreamInList';

const DATA_STREAM: DataStream = {
  id: 'abc-1',
  data: [
    { x: 1, y: 0 },
    { x: 2, y: 1 },
  ],
  resolution: 0,
  name: 'my-name',
};
const yMins = [
  {
    datastream: DATA_STREAM,
    color: '#fcba03',
    value: DATA_STREAM.data[0],
    significantDigits: 4,
  },
];
const yMaxs = [
  {
    datastream: DATA_STREAM,
    color: '#20d91a',
    value: DATA_STREAM.data[1],
    significantDigits: 4,
  },
];

describe('MultiYAxisLegend', () => {
  it('renders a ymin legend and a ymax legend', () => {
    act(() => {
      render(<MultiYAxisLegend height={1000} yMax={[]} yMin={[]} />);
    });
    act(() => {
      expect(screen.getByText('Y-Min')).not.toBeNull();
      expect(screen.getByText('Y-Max')).not.toBeNull();
    });
  });

  it('renders a ymin and ymax options', () => {
    act(() => {
      render(<MultiYAxisLegend height={1000} yMax={yMaxs} yMin={yMins} />);
    });
    act(() => {
      screen.getByText('Y-Min').click();
      screen.getByText('Y-Max').click();
    });
    act(() => {
      expect(screen.getByText('0')).not.toBeNull();
      expect(screen.getByText('1')).not.toBeNull();
    });
  });

  it('highlights a datastream on hover', () => {
    act(() => {
      render(<MultiYAxisLegend height={1000} yMax={yMaxs} yMin={yMins} />);
    });
    act(() => {
      screen.getByText('Y-Min').click();
      screen.getByText('Y-Max').click();
    });
    act(() => {
      fireEvent.pointerEnter(screen.getByText('0'));
    });
    const { result: highlightedDataStreams, rerender: rerenderHighlightedDataStreams } = renderHook(() =>
      useChartStore((state) => state.highlightedDataStreams)
    );
    expect(highlightedDataStreams.current).toEqual([DATA_STREAM]);
    expect(isDataStreamInList(highlightedDataStreams.current)(DATA_STREAM)).toBeTrue();

    act(() => {
      fireEvent.pointerLeave(screen.getByText('0'));
    });
    rerenderHighlightedDataStreams();
    expect(highlightedDataStreams.current).toEqual([]);
    expect(isDataStreamInList(highlightedDataStreams.current)(DATA_STREAM)).toBeFalse();
  });
});
