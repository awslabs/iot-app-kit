import { describe } from '@jest/globals';
import { render, renderHook } from '@testing-library/react';
import useTrendCursorsEvents from '../hooks/useTrendCursorsEvents';
import { mockSeries, mockSize, mockViewport } from './getTrendCursor.spec';
import { useECharts } from '../../../hooks/useECharts';
import React from 'react';
import { InternalGraphicComponentGroupOption } from '../types';

describe('useTrendCursorsEvents', () => {
  const { result } = renderHook(() =>
    useECharts({
      option: {},
      loading: false,
      size: mockSize,
      theme: 'dark',
      groupId: 'group1',
    })
  );

  render(<div ref={result.current.ref} className='base-chart-element' data-testid='blah' style={mockSize} />);

  it('when there are no user event, set state should not be called', () => {
    const mockSetGraphic = jest.fn();
    renderHook(() =>
      useTrendCursorsEvents({
        isInCursorAddMode: false,
        ref: result.current.ref,
        setGraphic: mockSetGraphic,
        graphic: [],
        size: mockSize,
        viewport: mockViewport,
        series: mockSeries,
        yMax: 30,
        yMin: 0,
        isInSyncMode: false,
        onContextMenu: jest.fn(),
      })
    );

    expect(mockSetGraphic).not.toBeCalled();
  });

  it('when user click on add Trend Cursor, set state should not be called', () => {
    const mockSetGraphic = jest.fn();
    const hook = renderHook(() =>
      useTrendCursorsEvents({
        isInCursorAddMode: false,
        ref: result.current.ref,
        setGraphic: mockSetGraphic,
        graphic: [],
        size: mockSize,
        viewport: mockViewport,
        series: mockSeries,
        yMax: 30,
        yMin: 0,
        isInSyncMode: false,
        onContextMenu: jest.fn(),
      })
    );

    hook.result.current.onContextMenuClickHandler({ action: 'add', posX: 100 });
    expect(mockSetGraphic).toBeCalled();
  });

  it('when user click on delete Trend Cursor, set state should not be called', () => {
    const mockSetGraphic = jest.fn();
    const hook = renderHook(() =>
      useTrendCursorsEvents({
        isInCursorAddMode: false,
        ref: result.current.ref,
        setGraphic: mockSetGraphic,
        graphic: [{ timestampInMs: 1689264600000 } as InternalGraphicComponentGroupOption],
        size: mockSize,
        viewport: mockViewport,
        series: mockSeries,
        yMax: 30,
        yMin: 0,
        isInSyncMode: false,
        onContextMenu: jest.fn(),
      })
    );

    hook.result.current.onContextMenuClickHandler({ action: 'delete', posX: 100 });
    expect(mockSetGraphic).toBeCalled();
  });
});
