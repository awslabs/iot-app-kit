import { describe, expect } from '@jest/globals';
import { ElementEvent, SeriesOption } from 'echarts';
import addNewTrendCursor from '../addTrendCursor';

export const mockSeries = [
  {
    name: 'Average Wind Speed',
    data: [
      [1689264600000, 22.939564631713747],
      [1689264900000, 24.054178935438895],
      [1689265200000, 20.840328700172748],
      [1689265500000, 17.627425014582514],
      [1689265800000, 17.521569204159785],
    ],
    type: 'line',
    step: false,
    symbol: 'circle',
    symbolSize: 4,
    itemStyle: {
      color: '#2ea597',
    },
    lineStyle: {
      color: '#2ea597',
      type: 'solid',
      width: 2,
    },
    yAxisIndex: 0,
  },
] as SeriesOption[];
describe('addNewTrendCursor', () => {
  const mockSize = { width: 500, height: 500 };

  const mockViewport = {
    start: new Date('2023-07-13T16:00:00.000Z'),
    end: new Date('2023-07-13T16:30:00.000Z'),
  };
  it('should add a new TC', () => {
    const mockEvent = {} as ElementEvent;
    const mockSetGraphic = () => jest.fn();
    const newTrendCursor = addNewTrendCursor(
      mockEvent,
      mockSize,
      0,
      [],
      mockSetGraphic,
      mockSeries,
      50,
      0,
      mockViewport
    );

    expect(newTrendCursor).not.toBeNull();
    expect(newTrendCursor[0].children.length).toBe(4);
  });

  it('on drag to left of the line should provide the first value of line', () => {
    const mockEvent = {} as ElementEvent;
    const mockSetGraphic = () => jest.fn();
    const newTrendCursor = addNewTrendCursor(
      mockEvent,
      mockSize,
      0,
      [],
      mockSetGraphic,
      mockSeries,
      50,
      0,
      mockViewport
    );

    if (newTrendCursor[0]!.children[0]!.ondrag) {
      newTrendCursor[0]!.children[0]!.ondrag({
        target: { id: newTrendCursor[0].children[0].id },
        offsetX: 51,
      } as never);
      expect(newTrendCursor[0].x).toBe(51);
    }
  });

  it('on drag should should the TC x co-ordinate', () => {
    const mockEvent = {} as ElementEvent;
    const mockSetGraphic = () => jest.fn();
    const newTrendCursor = addNewTrendCursor(
      mockEvent,
      mockSize,
      0,
      [],
      mockSetGraphic,
      mockSeries,
      50,
      0,
      mockViewport
    );

    if (newTrendCursor[0]!.children[0]!.ondrag) {
      newTrendCursor[0]!.children[0]!.ondrag({
        target: { id: newTrendCursor[0].children[0].id },
        offsetX: 100,
      } as never);
      expect(newTrendCursor[0].x).toBe(100);
    }
  });

  it('on delete should should the TC x co-ordinate', () => {
    const mockEvent = {} as ElementEvent;
    const mockSetGraphic = () => jest.fn();
    const newTrendCursor = addNewTrendCursor(
      mockEvent,
      mockSize,
      0,
      [],
      mockSetGraphic,
      mockSeries,
      50,
      0,
      mockViewport
    );

    if (newTrendCursor[0]!.children[2]!.onmousedown) {
      newTrendCursor[0]!.children[2]!.onmousedown({
        target: { id: newTrendCursor[0].children[2].id },
      } as never);
      expect(newTrendCursor.length).toBe(0);
    }
  });
});
