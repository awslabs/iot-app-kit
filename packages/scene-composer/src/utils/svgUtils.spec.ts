import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three-stdlib';
import { Group as THREEGroup, MeshBasicMaterial as THREEMeshBasicMaterial } from 'three';
import React from 'react';

import { ViewCursorEditIcon } from '../assets';

import { convertSvgToMesh, createMesh } from './svgUtils';

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('three-stdlib');
  return {
    ...originalModule,
    useLoader: jest.fn(),
    createShapes: jest.fn(),
    SVGLoader: jest.fn(),
  };
});
describe('svgUtils', () => {
  describe('createSvg', () => {
    it('creates a mesh to be a type of THREEGroup', () => {
      const data = useLoader(SVGLoader, ViewCursorEditIcon.dataUri);
      const svgMesh = convertSvgToMesh(data);
      expect(svgMesh).toBeInstanceOf(THREEGroup);
    });
    it('should silently fail if passed an undefined', () => {
      const svgMesh = convertSvgToMesh(undefined);
      expect(svgMesh).toBeInstanceOf(THREEGroup);
    });
    it('should silently fail if passed a null', () => {
      const svgMesh = convertSvgToMesh(null);
      expect(svgMesh).toBeInstanceOf(THREEGroup);
    });
  });
  describe('createMesh', () => {
    it('can create a mesh', () => {
      const mesh = createMesh('white', 1);
      expect(mesh).toBeInstanceOf(THREEMeshBasicMaterial);
      expect(JSON.stringify(mesh.color)).toBe('16777215');
      expect(mesh.opacity).toBe(1);
    });
  });
});
