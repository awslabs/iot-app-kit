import { type DataStream } from '@iot-app-kit/core';
import { renderHook } from '@testing-library/react';
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

const DATA_STREAM_2: DataStream = {
  id: 'abc-2',
  data: [
    { x: 2, y: 1 },
    { x: 1, y: 0 },
  ],
  resolution: 0,
  name: 'my-name2',
};

const setupStore = () => {
  const { result: setDataStreamHidden } = renderHook(() =>
    useChartStore((state) => state.hideDataStream)
  );
  const { result: setDataStreamHighlighted } = renderHook(() =>
    useChartStore((state) => state.highlightDataStream)
  );
  act(() => {
    setDataStreamHidden.current(DATA_STREAM);
    setDataStreamHighlighted.current(DATA_STREAM);
  });
};

const teardownStore = () => {
  const { result: setDataStreamUnHidden } = renderHook(() =>
    useChartStore((state) => state.unHideDataStream)
  );
  const { result: setDataStreamUnHighlighted } = renderHook(() =>
    useChartStore((state) => state.unHighlightDataStream)
  );
  act(() => {
    setDataStreamUnHidden.current(DATA_STREAM);
    setDataStreamUnHighlighted.current(DATA_STREAM);
  });
};

describe('Data Stream Store Hide/Show and Highlighting', () => {
  beforeEach(setupStore);
  afterEach(teardownStore);

  it('adds hidden datastreams to data stream store', () => {
    const { result: hiddenDataStreams } = renderHook(() =>
      useChartStore((state) => state.hiddenDataStreams)
    );
    const isDataStreamHidden = isDataStreamInList(hiddenDataStreams.current);
    expect(isDataStreamHidden(DATA_STREAM)).toBe(true);
    expect(isDataStreamHidden(DATA_STREAM_2)).toBe(false);
  });

  it('adds highlighted datastreams to data stream store', () => {
    const { result: highlightedDataStreams } = renderHook(() =>
      useChartStore((state) => state.highlightedDataStreams)
    );
    const isDataStreamHidden = isDataStreamInList(
      highlightedDataStreams.current
    );
    expect(isDataStreamHidden(DATA_STREAM)).toBe(true);
    expect(isDataStreamHidden(DATA_STREAM_2)).toBe(false);
  });
});
