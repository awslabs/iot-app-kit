import { Object3D } from 'three';

import { getPropertyForKeyEvent, handleKeyEventTransform } from './keyboardUtils';

describe('Keyboard utils', () => {
  const translateProperty = getPropertyForKeyEvent('translate');
  const rotateProperty = getPropertyForKeyEvent('rotate');
  const scaleProperty = getPropertyForKeyEvent('scale');

  it('should return a property and value from a mode', () => {
    expect(translateProperty.property).toBe('position');
    expect(translateProperty.amount).toBeGreaterThan(0);
    expect(rotateProperty.property).toBe('rotation');
    expect(rotateProperty.amount).toBeGreaterThan(0);
    expect(scaleProperty.property).toBe('scale');
    expect(scaleProperty.amount).toBeGreaterThan(0);
  });

  it('should transform an object based on key events', () => {
    const mockObject = new Object3D();
    const leftKeyEvent = {
      key: 'ArrowLeft',
    } as KeyboardEvent;
    const rightKeyEvent = {
      key: 'ArrowRight',
    } as KeyboardEvent;
    const upKeyEvent = {
      key: 'ArrowUp',
    } as KeyboardEvent;
    const downKeyEvent = {
      key: 'ArrowDown',
    } as KeyboardEvent;
    const upShiftKeyEvent = {
      key: 'ArrowUp',
      shiftKey: true,
    } as KeyboardEvent;
    const downShiftKeyEvent = {
      key: 'ArrowDown',
      shiftKey: true,
    } as KeyboardEvent;
    handleKeyEventTransform(mockObject, leftKeyEvent, 'position', 1);
    expect(mockObject.position.x).toBe(-1);
    handleKeyEventTransform(mockObject, rightKeyEvent, 'position', 1);
    expect(mockObject.position.x).toBe(0);
    handleKeyEventTransform(mockObject, upKeyEvent, 'position', 1);
    expect(mockObject.position.y).toBe(1);
    handleKeyEventTransform(mockObject, downKeyEvent, 'position', 1);
    expect(mockObject.position.y).toBe(0);
    handleKeyEventTransform(mockObject, downShiftKeyEvent, 'position', 1);
    expect(mockObject.position.z).toBe(-1);
    handleKeyEventTransform(mockObject, upShiftKeyEvent, 'position', 1);
    expect(mockObject.position.z).toBe(0);
  });
});
