import { act, renderHook } from '@testing-library/react';
import useIsRefreshing from './useIsrefreshing';

describe('useIsRefreshing hook testing', () => {
  it('should set delayLoading to true when isRefreshing is true after delay', () => {
    vi.useFakeTimers();
    const delay = 3000;
    const { result, rerender } = renderHook(() => useIsRefreshing(true, delay));

    rerender();
    expect(result.current).toBe(false);

    rerender();
    act(() => {
      vi.advanceTimersByTime(delay);
    });
    expect(result.current).toBe(true);

    vi.useRealTimers();
  });

  it('should set delayLoading to false when isRefreshing is false', () => {
    vi.useFakeTimers();
    const delay = 2000;
    const { result, rerender } = renderHook(() =>
      useIsRefreshing(false, delay)
    );

    rerender();
    expect(result.current).toBe(false);

    rerender();
    act(() => {
      vi.advanceTimersByTime(delay);
    });
    expect(result.current).toBe(false);
    vi.useRealTimers();
  });
});
