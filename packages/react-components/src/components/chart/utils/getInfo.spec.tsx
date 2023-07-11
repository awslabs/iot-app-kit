import { describe, expect } from '@jest/globals';
import { addNewTrendCursor, setXWithBounds } from './getInfo';
import { ElementEvent } from 'echarts';

describe('Testing Charts getInfo', () => {
  const mockSize = { width: 500, height: 500 };

  describe('addNewTrendCursor', () => {
    it('should add a new TC', () => {
      const mockEvent = {} as ElementEvent;
      const mockSetGraphic = () => jest.fn();
      const mockViewport = { duration: '5m' };
      const newTrendCursor = addNewTrendCursor(mockEvent, mockSize, 0, [], mockSetGraphic, mockViewport);

      expect(newTrendCursor).not.toBeNull();
      expect(newTrendCursor[0].children.length).toBe(3);
    });

    it('on drag should should the TC x co-ordinate', () => {
      const mockEvent = {} as ElementEvent;
      const mockSetGraphic = () => jest.fn();
      const mockViewport = { duration: '5m' };
      const newTrendCursor = addNewTrendCursor(mockEvent, mockSize, 0, [], mockSetGraphic, mockViewport);

      if (newTrendCursor[0]!.children[0]!.ondrag) {
        newTrendCursor[0]!.children[0]!.ondrag({
          target: { id: newTrendCursor[0].children[0].id },
          offsetX: 100,
        } as never);
        expect(newTrendCursor[0].children[1].x).toBe(100);
      }
    });

    it('on delete should should the TC x co-ordinate', () => {
      const mockEvent = {} as ElementEvent;
      const mockSetGraphic = () => jest.fn();
      const mockViewport = { duration: '5m' };
      const newTrendCursor = addNewTrendCursor(mockEvent, mockSize, 0, [], mockSetGraphic, mockViewport);

      if (newTrendCursor[0]!.children[2]!.onmousedown) {
        newTrendCursor[0]!.children[2]!.onmousedown({
          target: { id: newTrendCursor[0].children[2].id },
        } as never);
        expect(newTrendCursor.length).toBe(0);
      }
    });
  });

  describe('setXWithBounds', () => {
    it('should return max of width minus margin', () => {
      const maxX = setXWithBounds(mockSize, 475);

      expect(maxX).toBe(450);
    });

    it('should return min of margin', () => {
      const maxX = setXWithBounds(mockSize, 20);

      expect(maxX).toBe(50);
    });
  });
});
