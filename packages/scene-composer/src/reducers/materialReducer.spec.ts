import { act, renderHook } from '@testing-library/react';
import { useReducer } from 'react';
import { Color, Mesh, MeshBasicMaterial } from 'three';

import {
  addMaterial,
  backUpOriginalMaterial,
  initialMaterialMaps,
  materialReducer,
  removeMaterial,
} from './materialReducer';

describe('materialReducer', () => {
  const transformedColor = new Color(0x000000);
  const secondTransformColor = new Color(0xff0000);
  const originalColor = new Color(0x00ff00);

  it('should backup a material', () => {
    const [materialMaps, dispatch] = renderHook(() => useReducer(materialReducer, initialMaterialMaps)).result.current;

    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));

    act(() => {
      backUpOriginalMaterial(mesh, materialMaps, dispatch);
    });
    const backUpColor = materialMaps.original[mesh.uuid].color;
    expect(backUpColor.getHex()).toBe(originalColor.getHex());
  });

  it('should apply a color with rules overwriting highlights', () => {
    const [materialMaps, dispatch] = renderHook(() => useReducer(materialReducer, initialMaterialMaps)).result.current;

    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    act(() => {
      backUpOriginalMaterial(mesh, materialMaps, dispatch);
    });

    const newMaterial = mesh.material.clone();
    newMaterial.color = transformedColor;
    act(() => {
      addMaterial(mesh, newMaterial, 'highlights', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(transformedColor.getHex());

    const newMaterial2 = mesh.material.clone();
    newMaterial2.color = secondTransformColor;
    act(() => {
      addMaterial(mesh, newMaterial2, 'rules', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(secondTransformColor.getHex());
  });

  it('should apply a color with highlight not overwriting rules', () => {
    const [materialMaps, dispatch] = renderHook(() => useReducer(materialReducer, initialMaterialMaps)).result.current;

    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    act(() => {
      backUpOriginalMaterial(mesh, materialMaps, dispatch);
    });

    const newMaterial = mesh.material.clone();
    newMaterial.color = transformedColor;
    act(() => {
      addMaterial(mesh, newMaterial, 'rules', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(transformedColor.getHex());

    const newMaterial2 = mesh.material.clone();
    newMaterial2.color = secondTransformColor;
    act(() => {
      addMaterial(mesh, newMaterial2, 'highlights', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(transformedColor.getHex());
  });

  it('should remove colors with highlights returning when rules are removed', () => {
    const [materialMaps, dispatch] = renderHook(() => useReducer(materialReducer, initialMaterialMaps)).result.current;

    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    act(() => {
      backUpOriginalMaterial(mesh, materialMaps, dispatch);
    });

    const newMaterial = mesh.material.clone();
    newMaterial.color = transformedColor;
    act(() => {
      addMaterial(mesh, newMaterial, 'highlights', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(transformedColor.getHex());

    const newMaterial2 = mesh.material.clone();
    newMaterial2.color = secondTransformColor;
    act(() => {
      addMaterial(mesh, newMaterial2, 'rules', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(secondTransformColor.getHex());

    act(() => {
      removeMaterial(mesh, 'rules', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(transformedColor.getHex());
  });

  it('should remove highlight colors with original being restored', () => {
    const [materialMaps, dispatch] = renderHook(() => useReducer(materialReducer, initialMaterialMaps)).result.current;

    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    act(() => {
      backUpOriginalMaterial(mesh, materialMaps, dispatch);
    });

    const newMaterial = mesh.material.clone();
    newMaterial.color = transformedColor;
    act(() => {
      addMaterial(mesh, newMaterial, 'highlights', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(transformedColor.getHex());

    act(() => {
      removeMaterial(mesh, 'highlights', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(originalColor.getHex());
  });

  it('should remove rules colors with original being restored', () => {
    const [materialMaps, dispatch] = renderHook(() => useReducer(materialReducer, initialMaterialMaps)).result.current;

    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    act(() => {
      backUpOriginalMaterial(mesh, materialMaps, dispatch);
    });

    const newMaterial = mesh.material.clone();
    newMaterial.color = transformedColor;
    act(() => {
      addMaterial(mesh, newMaterial, 'rules', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(transformedColor.getHex());

    act(() => {
      removeMaterial(mesh, 'rules', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(originalColor.getHex());
  });

  it('should remove submodel colors with original being restored', () => {
    const [materialMaps, dispatch] = renderHook(() => useReducer(materialReducer, initialMaterialMaps)).result.current;

    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    act(() => {
      backUpOriginalMaterial(mesh, materialMaps, dispatch);
    });

    const newMaterial = mesh.material.clone();
    newMaterial.color = transformedColor;
    act(() => {
      addMaterial(mesh, newMaterial, 'subModel', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(transformedColor.getHex());

    act(() => {
      removeMaterial(mesh, 'subModel', materialMaps, dispatch);
    });
    expect(mesh.material.color.getHex()).toBe(originalColor.getHex());
  });
});
