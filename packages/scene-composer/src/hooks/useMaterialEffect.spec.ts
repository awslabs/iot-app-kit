import { useEffect, useCallback } from 'react';
import { Object3D, Event, Mesh, MeshBasicMaterial, Color } from 'three';

import useMaterialEffect from './useMaterialEffect';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((cb) => cb),
  useEffect: jest.fn(),
  useRef: jest.fn((i) => ({ current: i })),
}));

const times = (count: number, cb: (i: number) => void) => {
  for (let i = 0; i < count; i++) {
    cb(i);
  }
};

describe('useMaterialEffect', () => {
  it('should restore when restored', () => {
    const object = new Object3D<Event>();
    const transformedColor = 0x000000;
    const originalColor = 0x00ff00;

    (useEffect as jest.Mock).mockImplementationOnce((cb) => cb());

    times(5, () => {
      const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: new Color(originalColor) }));
      mesh.userData.isOriginal = true;
      object.children.push(mesh);
    });

    const [transform, restore] = useMaterialEffect((obj) => {
      if (obj instanceof Mesh) {
        obj.material.color = transformedColor;
      }
    }, object);

    transform();

    const transformedColors = object.children.map((c) => (c as any).material.color);

    expect(transformedColors).toMatchInlineSnapshot(`
      Array [
        0,
        0,
        0,
        0,
        0,
      ]
    `);

    restore();

    const restoredColors = object.children.map((c) => (c as any).material.color);

    expect(restoredColors).toMatchInlineSnapshot(`
      Array [
        65280,
        65280,
        65280,
        65280,
        65280,
      ]
    `);
  });
});
