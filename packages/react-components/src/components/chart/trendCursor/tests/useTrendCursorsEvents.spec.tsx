import { describe } from '@jest/globals';
import { render, renderHook } from '@testing-library/react';
import useTrendCursorsEvents from '../mouseEvents/useTrendCursorsEvents';
import { mockGraphic, mockSeries, mockSize } from './getTrendCursor.spec';
import { useECharts } from '../../../../hooks/useECharts';
import React from 'react';
import { DEFAULT_CHART_VISUALIZATION } from '../../eChartsConstants';
import { InternalGraphicComponentGroupOption } from '../types';
import { Colorizer } from '@iot-app-kit/core-util';

describe('useTrendCursorsEvents', () => {
  const { result } = renderHook(() => useECharts('dark'));

  render(<div ref={result.current.ref} className='base-chart-element' data-testid='blah' style={mockSize} />);

  it('when there are no user event, set state should not be called', () => {
    const mockSetGraphic = jest.fn();
    renderHook(() =>
      useTrendCursorsEvents({
        isInCursorAddMode: false,
        chartRef: result.current.chartRef,
        setGraphic: mockSetGraphic,
        graphic: [],
        size: mockSize,
        series: mockSeries,
        isInSyncMode: false,
        onContextMenu: jest.fn(),
        visualization: DEFAULT_CHART_VISUALIZATION,
        getColor: Colorizer().next,
      })
    );

    expect(mockSetGraphic).not.toBeCalled();
  });

  it('when user click on delete Trend Cursor, set state should be called', () => {
    const mockSetGraphic = jest.fn();
    const hook = renderHook(() =>
      useTrendCursorsEvents({
        isInCursorAddMode: false,
        chartRef: result.current.chartRef,
        setGraphic: mockSetGraphic,
        graphic: [mockGraphic as InternalGraphicComponentGroupOption],
        size: mockSize,
        series: mockSeries,
        isInSyncMode: false,
        onContextMenu: jest.fn(),
        visualization: DEFAULT_CHART_VISUALIZATION,
        getColor: Colorizer().next,
      })
    );

    hook.result.current.onContextMenuClickHandler({ action: 'delete', posX: 100 });
    expect(mockSetGraphic).toBeCalled();
  });
});
