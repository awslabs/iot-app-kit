import { Object3D, Mesh, MeshBasicMaterial, Color } from 'three';

import { type MeshStyle } from '../interfaces/';

import { createMaterialFromStyle } from './objectThreeStyleUtils';

describe('objectThreeStyleUtils', () => {
  const originalColor = new Color(0x00ff00);
  const stringColor = new Color('red');
  const numberColor = new Color(0xff0000);

  it('should make a material from a style with color string', () => {
    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    expect(mesh.material.color.getHex()).toBe(originalColor.getHex());
    expect(mesh.material.opacity).toBe(1);
    expect(mesh.material.transparent).toBe(false);

    const style: MeshStyle = {
      color: 'red',
      opacity: 0.5,
      transparent: true,
    };

    const newMaterial = createMaterialFromStyle(mesh, style);
    expect(newMaterial?.color.getHex()).toBe(stringColor.getHex());
    expect(newMaterial?.opacity).toBe(0.5);
    expect(newMaterial?.transparent).toBe(true);
  });

  it('should make a material from a style with transparency and no opacity', () => {
    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    expect(mesh.material.color.getHex()).toBe(originalColor.getHex());
    expect(mesh.material.opacity).toBe(1);
    expect(mesh.material.transparent).toBe(false);

    const style: MeshStyle = {
      transparent: true,
    };

    const newMaterial = createMaterialFromStyle(mesh, style);
    expect(newMaterial?.color.getHex()).toBe(originalColor.getHex());
    expect(newMaterial?.opacity).toBe(1);
    expect(newMaterial?.transparent).toBe(true);
  });

  it('should make a material from a style with color hex number', () => {
    const mesh = new Mesh(undefined, new MeshBasicMaterial({ color: originalColor }));
    expect(mesh.material.color.getHex()).toBe(originalColor.getHex());
    expect(mesh.material.opacity).toBe(1);
    expect(mesh.material.transparent).toBe(false);

    const style: MeshStyle = {
      color: 0xff0000,
    };

    const newMaterial = createMaterialFromStyle(mesh, style);
    expect(newMaterial?.color.getHex()).toBe(numberColor.getHex());
    expect(newMaterial?.opacity).toBe(1);
    expect(newMaterial?.transparent).toBe(false);
  });

  it('should return null for non-meshs', () => {
    const object = new Object3D();

    const style: MeshStyle = {
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
    };

    const newMaterial = createMaterialFromStyle(object, style);
    expect(newMaterial).toBeNull();
  });
});
