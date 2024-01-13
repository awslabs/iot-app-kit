import { renderHook } from '@testing-library/react';
import { useHighlightedDataStreams } from './useHighlightedDataStreams';

describe('useHighlightedDataStreams', () => {
  it('can highlight data streams', () => {
    const { result, rerender } = renderHook(() => useHighlightedDataStreams());

    expect(result.current.highlightedDataStreams).toBeArrayOfSize(0);

    result.current.highlightDataStream({ id: '1' });

    rerender();

    expect(result.current.highlightedDataStreams).toEqual(
      expect.arrayContaining([{ id: '1' }])
    );
  });

  it('can unhighlight data streams', () => {
    const { result, rerender } = renderHook(() => useHighlightedDataStreams());

    result.current.highlightDataStream({ id: '1' });

    rerender();

    result.current.unHighlightDataStream({ id: '1' });

    rerender();

    expect(result.current.highlightedDataStreams).toBeArrayOfSize(0);
  });

  it('has a list of highlighted data streams', () => {
    const { result, rerender } = renderHook(() => useHighlightedDataStreams());

    expect(result.current.highlightedDataStreams).toBeArrayOfSize(0);

    result.current.highlightDataStream({ id: '1' });
    result.current.highlightDataStream({ id: '2' });

    rerender();

    expect(result.current.highlightedDataStreams).toEqual(
      expect.arrayContaining([{ id: '1' }, { id: '2' }])
    );

    result.current.unHighlightDataStream({ id: '1' });

    rerender();

    expect(result.current.highlightedDataStreams).toEqual(
      expect.arrayContaining([{ id: '2' }])
    );
  });

  it('can toggle a datastreams highlighting', () => {
    const { result, rerender } = renderHook(() => useHighlightedDataStreams());

    expect(result.current.highlightedDataStreams).toBeArrayOfSize(0);

    result.current.toggleHighlighted({ id: '1' });

    rerender();

    expect(result.current.highlightedDataStreams).toEqual(
      expect.arrayContaining([{ id: '1' }])
    );

    result.current.toggleHighlighted({ id: '1' });

    rerender();

    expect(result.current.highlightedDataStreams).toBeArrayOfSize(0);
  });

  it('can check if a datastream is highlighted', () => {
    const { result, rerender } = renderHook(() => useHighlightedDataStreams());

    expect(result.current.highlightedDataStreams).toBeArrayOfSize(0);

    result.current.highlightDataStream({ id: '1' });
    result.current.highlightDataStream({ id: '2' });

    rerender();

    expect(result.current.isDataStreamHighlighted({ id: '1' })).toBeTrue();

    result.current.unHighlightDataStream({ id: '1' });

    rerender();

    expect(result.current.isDataStreamHighlighted({ id: '1' })).toBeFalse();
  });
});
