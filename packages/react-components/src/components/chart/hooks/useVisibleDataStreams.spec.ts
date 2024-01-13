import { renderHook } from '@testing-library/react';
import { useVisibleDataStreams } from './useVisibleDataStreams';

describe('useVisibleDataStreams', () => {
  it('can hide data streams', () => {
    const { result, rerender } = renderHook(() => useVisibleDataStreams());

    expect(result.current.hiddenDataStreams).toBeArrayOfSize(0);

    result.current.hideDataStream({ id: '1' });

    rerender();

    expect(result.current.hiddenDataStreams).toEqual(
      expect.arrayContaining([{ id: '1' }])
    );
  });

  it('can show data streams', () => {
    const { result, rerender } = renderHook(() => useVisibleDataStreams());

    result.current.hideDataStream({ id: '1' });

    rerender();

    result.current.unHideDataStream({ id: '1' });

    rerender();

    expect(result.current.hiddenDataStreams).toBeArrayOfSize(0);
  });

  it('has a list of hidden data streams', () => {
    const { result, rerender } = renderHook(() => useVisibleDataStreams());

    expect(result.current.hiddenDataStreams).toBeArrayOfSize(0);

    result.current.hideDataStream({ id: '1' });
    result.current.hideDataStream({ id: '2' });

    rerender();

    expect(result.current.hiddenDataStreams).toEqual(
      expect.arrayContaining([{ id: '1' }, { id: '2' }])
    );

    result.current.unHideDataStream({ id: '1' });

    rerender();

    expect(result.current.hiddenDataStreams).toEqual(
      expect.arrayContaining([{ id: '2' }])
    );
  });

  it('can toggle a datastreams visibility', () => {
    const { result, rerender } = renderHook(() => useVisibleDataStreams());

    expect(result.current.hiddenDataStreams).toBeArrayOfSize(0);

    result.current.toggleVisibility({ id: '1' });

    rerender();

    expect(result.current.hiddenDataStreams).toEqual(
      expect.arrayContaining([{ id: '1' }])
    );

    result.current.toggleVisibility({ id: '1' });

    rerender();

    expect(result.current.hiddenDataStreams).toBeArrayOfSize(0);
  });

  it('can check if a datastream is visible', () => {
    const { result, rerender } = renderHook(() => useVisibleDataStreams());

    expect(result.current.hiddenDataStreams).toBeArrayOfSize(0);

    result.current.hideDataStream({ id: '1' });
    result.current.hideDataStream({ id: '2' });

    rerender();

    expect(result.current.isDataStreamHidden({ id: '1' })).toBeTrue();

    result.current.unHideDataStream({ id: '1' });

    rerender();

    expect(result.current.isDataStreamHidden({ id: '1' })).toBeFalse();
  });
});
