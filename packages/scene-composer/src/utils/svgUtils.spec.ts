import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three-stdlib';
import { Group as THREEGroup, MeshBasicMaterial as THREEMeshBasicMaterial, Vector3 } from 'three';

import { ViewCursorEditSvgString } from '../assets/svgs';

import { convertSvgToMesh, createMesh, getDataUri } from './svgUtils';

vi.mock('@react-three/fiber', async () => {
  const originalModule = await vi.importActual('three-stdlib');
  return {
    ...originalModule,
    useLoader: vi.fn(),
    createShapes: vi.fn(),
    SVGLoader: vi.fn(),
  };
});
describe('svgUtils', () => {
  describe('createSvg', () => {
    it('creates a mesh to be a type of THREEGroup', () => {
      const data = useLoader(SVGLoader, getDataUri(ViewCursorEditSvgString));
      const scaleMult = 2;
      const svgMesh = convertSvgToMesh(data, scaleMult);
      expect(svgMesh).toBeInstanceOf(THREEGroup);
      expect(svgMesh.scale).toStrictEqual(new Vector3(scaleMult, scaleMult, scaleMult));
    });
    it('should silently fail if passed an undefined', () => {
      const svgMesh = convertSvgToMesh(undefined, 1);
      expect(svgMesh).toBeInstanceOf(THREEGroup);
    });
    it('should silently fail if passed a null', () => {
      const svgMesh = convertSvgToMesh(null, 1);
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

  it('should return correct data uri for svg', () => {
    const expected =
      "data:image/svg+xml, %0A%20%20%3Csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20xmlns='http://www.w3.org/2000/svg'%3E%0A%20%20%20%20%3Cg%20fill='none'%3E%0A%20%20%20%20%20%20%3Ccircle%20cx='7.99938'%20cy='8.00036'%20r='5.81579'%20stroke='white'%20/%3E%0A%20%20%20%20%20%20%3Cline%20x1='8.07812'%20y1='2.18557e-08'%20x2='8.07812'%20y2='16'%20stroke='white'%20/%3E%0A%20%20%20%20%20%20%3Cline%20x1='16'%20y1='8.0791'%20y2='8.0791'%20stroke='white'%20/%3E%0A%20%20%20%20%3C/g%3E%0A%20%20%3C/svg%3E%0A";
    const result = getDataUri(ViewCursorEditSvgString);

    expect(result).toEqual(expected);
  });
});
