import { act, renderHook } from '@testing-library/react';
import { useViewportToMS } from './useViewportToMS';

describe(useViewportToMS, () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle undefined viewports', () => {
    const { result } = renderHook(() => useViewportToMS());

    expect(result.current).toEqual({
      initial: 0,
      end: 0,
      widthInMs: 0,
      isDurationViewport: false,
    });
  });

  it('should handle relative viewports', () => {
    const { result, rerender } = renderHook(({ viewport }) => useViewportToMS(viewport), {
      initialProps: {
        viewport: {
          duration: '5m',
        },
      },
    });

    const expected5mWidthInMs = 300_000;

    expect(result.current).toEqual({
      initial: new Date(Date.now() - expected5mWidthInMs).getTime(),
      end: new Date(Date.now()).getTime(),
      widthInMs: expected5mWidthInMs,
      isDurationViewport: true,
    });

    rerender({ viewport: { duration: '10m' } });

    const expected10mWidthInMs = 600_000;

    expect(result.current).toEqual({
      initial: new Date(Date.now() - expected10mWidthInMs).getTime(),
      end: new Date(Date.now()).getTime(),
      widthInMs: expected10mWidthInMs,
      isDurationViewport: true,
    });
  });

  it('should only recalculate the same relative viewport every 1 second', () => {
    const { result } = renderHook(({ viewport }) => useViewportToMS(viewport), {
      initialProps: {
        viewport: {
          duration: '5m',
        },
      },
    });

    const expectedInitial1 = new Date(Date.now() - 300_000).getTime();
    const expectedEnd1 = new Date(Date.now()).getTime();

    expect(result.current).toEqual({
      initial: expectedInitial1,
      end: expectedEnd1,
      widthInMs: 300_000,
      isDurationViewport: true,
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // no update occured
    expect(result.current).toEqual({
      initial: expectedInitial1,
      end: expectedEnd1,
      widthInMs: 300_000,
      isDurationViewport: true,
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    const expectedInitial2 = new Date(Date.now() - 300_000).getTime();
    const expectedEnd2 = new Date(Date.now()).getTime();

    // update occured
    expect(result.current).toEqual({
      initial: expectedInitial2,
      end: expectedEnd2,
      widthInMs: 300_000,
      isDurationViewport: true,
    });
  });

  it('should handle absolute viewports', () => {
    const { result, rerender } = renderHook(({ viewport }) => useViewportToMS(viewport), {
      initialProps: {
        viewport: {
          start: new Date(5),
          end: new Date(10),
        },
      },
    });

    expect(result.current).toEqual({
      initial: 5,
      end: 10,
      widthInMs: 5,
      isDurationViewport: false,
    });

    rerender({
      viewport: {
        start: new Date(50),
        end: new Date(400),
      },
    });

    expect(result.current).toEqual({
      initial: 50,
      end: 400,
      widthInMs: 350,
      isDurationViewport: false,
    });
  });
});
