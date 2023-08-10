import { describe, expect } from '@jest/globals';
import { mockRef, mockSeries, mockSize, mockViewportInMs } from './getTrendCursor.spec';
import { renderHook } from '@testing-library/react';
import handleResize from '../utils/handleResize';
import { InternalGraphicComponentGroupOption } from '../types';
describe('handleResize', () => {
  const setGraphicStub = jest.fn();
  const useSyncProps = {
    isInSyncMode: true,
    graphic: [
      {
        id: 'trendCursor-1',
        timestampInMs: Date.now() - 500,
        children: [{}, {}, {}, {}],
      } as InternalGraphicComponentGroupOption,
    ],
    series: mockSeries,
    setGraphic: setGraphicStub,
    viewportInMs: mockViewportInMs,
    size: mockSize,
    groupId: 'group1',
    ref: mockRef,
  };

  it('set state should not be called when there is no change in size ', () => {
    renderHook(() =>
      handleResize({
        ...useSyncProps,
      })
    );
    expect(setGraphicStub).not.toBeCalled();
  });

  it('set state should be called when there is change in size ', () => {
    const { rerender } = renderHook((props) => handleResize(props), {
      initialProps: useSyncProps,
    });
    rerender({ ...useSyncProps, size: { height: 600, width: 700 } });
    expect(setGraphicStub).toBeCalled();
  });
});
