import { act, renderHook } from '@testing-library/react';
import useIsRefreshing from './useIsrefreshing';

describe('useIsRefreshing hook testing', () => {
  it('should set delayLoading to true when isRefreshing is true after delay', () => {
    jest.useFakeTimers();
    const delay = 3000;
    const { result, rerender } = renderHook(() => useIsRefreshing(true, delay));

    rerender();
    expect(result.current).toBe(false);

    rerender();
    act(() => {
      jest.advanceTimersByTime(delay);
    });
    expect(result.current).toBe(true);

    jest.useRealTimers();
  });

  it('should set delayLoading to false when isRefreshing is false', () => {
    jest.useFakeTimers();
    const delay = 2000;
    const { result, rerender } = renderHook(() =>
      useIsRefreshing(false, delay)
    );

    rerender();
    expect(result.current).toBe(false);

    rerender();
    act(() => {
      jest.advanceTimersByTime(delay);
    });
    expect(result.current).toBe(false);
    jest.useRealTimers();
  });
});
