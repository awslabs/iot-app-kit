import { useEffect } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react-hooks';
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
  it('should handle no object and not have exception', () => {
    (useEffect as jest.Mock).mockImplementationOnce((cb) => cb());
    const [transform, restore] = renderHook(() =>
      useMaterialEffect(() => {
        return null;
      }, 'rules'),
    ).result.current;
    act(() => {
      transform();
      restore();
    });
    cleanup();
  });

  it('should handle non mesh and not have expection ', () => {
    const object = new Object3D<Event>();
    (useEffect as jest.Mock).mockImplementationOnce((cb) => cb());
    times(5, () => {
      const child = new Object3D();
      child.userData.isOriginal = true;
      object.children.push(child);
    });
    const [transform, restore] = renderHook(() =>
      useMaterialEffect(
        () => {
          return null;
        },
        'rules',
        object,
      ),
    ).result.current;
    act(() => {
      transform();
      restore();
    });
    cleanup();
  });

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

    const [transform, restore] = renderHook(() =>
      useMaterialEffect(
        (obj) => {
          if (obj instanceof Mesh) {
            const newMaterial = obj.material.clone();
            newMaterial.color = transformedColor;
            return newMaterial;
          }
          return null;
        },
        'rules',
        object,
      ),
    ).result.current;

    act(() => {
      transform();
    });

    const transformedColors = object.children.map((c) => (c as any).material.color);

    expect(transformedColors).toMatchInlineSnapshot(`
      [
        0,
        0,
        0,
        0,
        0,
      ]
    `);

    act(() => {
      restore();
    });

    const restoredColors = object.children.map((c) => (c as any).material.color);

    expect(restoredColors).toMatchInlineSnapshot(`
      [
        65280,
        65280,
        65280,
        65280,
        65280,
      ]
    `);

    cleanup();
  });

  it('should not transform or restore if not original data', () => {
    const object = new Object3D<Event>();
    const transformedColor = 0x000000;
    const originalColor = 0x00ff00;

    (useEffect as jest.Mock).mockImplementationOnce((cb) => cb());

    times(5, () => {
      const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: new Color(originalColor) }));
      mesh.userData.isOriginal = false;
      object.children.push(mesh);
    });

    const [transform, restore] = renderHook(() =>
      useMaterialEffect(
        (obj) => {
          if (obj instanceof Mesh) {
            const newMaterial = obj.material.clone();
            newMaterial.color = transformedColor;
            return newMaterial;
          }
          return null;
        },
        'rules',
        object,
      ),
    ).result.current;

    act(() => {
      transform();
    });

    const transformedColors = object.children.map((c) => (c as any).material.color);

    expect(transformedColors).toMatchInlineSnapshot(`
      [
        65280,
        65280,
        65280,
        65280,
        65280,
      ]
    `);

    act(() => {
      restore();
    });

    const restoredColors = object.children.map((c) => (c as any).material.color);

    expect(restoredColors).toMatchInlineSnapshot(`
      [
        65280,
        65280,
        65280,
        65280,
        65280,
      ]
    `);

    cleanup();
  });
});
