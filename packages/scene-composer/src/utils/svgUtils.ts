import {
  AlwaysDepth as THREEAlwaysDepth,
  Box3 as THREEBox3,
  Color as THREEColor,
  DoubleSide as THREEDoubleSide,
  Group as THREEGroup,
  Mesh as THREEMesh,
  MeshBasicMaterial as THREEMeshBasicMaterial,
  Object3D as THREEObject3D,
  ShapeGeometry as THREEShapeGeometry,
} from 'three';
import { SVGLoader } from 'three-stdlib';

import { resetObjectCenter } from './objectThreeUtils';

export const createMesh = (color, opacity) => {
  return new THREEMeshBasicMaterial({
    color: new THREEColor().setStyle(color).convertSRGBToLinear(),
    opacity: opacity,
    transparent: true,
    depthFunc: THREEAlwaysDepth,
    side: THREEDoubleSide,
  });
};

export const convertSvgToMesh = (data) => {
  const svgGroup = new THREEGroup();
  /* istanbul ignore next */
  data?.paths?.forEach((path) => {
    const fillColor = path?.userData?.style.fill;
    const fillOpacity = path?.userData?.style.fillOpacity;
    if (fillColor !== undefined && fillColor !== 'none') {
      const fillMaterial = createMesh(fillColor, fillOpacity);
      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((line) => {
        const geometry = new THREEShapeGeometry(line);
        const mesh = new THREEMesh(geometry, fillMaterial);
        resetObjectCenter(mesh);
        svgGroup.add(mesh);
      });
    }
    const strokeColor = path?.userData?.style.stroke;
    const strokeOpacity = path?.userData?.style.strokeOpacity;
    if (strokeColor !== undefined && strokeColor !== 'none') {
      const strokeMaterial = createMesh(strokeColor, strokeOpacity);
      path.subPaths.forEach((childPath) => {
        const geometry = SVGLoader.pointsToStroke(childPath.getPoints(), path?.userData?.style);
        if (geometry) {
          const mesh = new THREEMesh(geometry, strokeMaterial);
          resetObjectCenter(mesh);
          svgGroup.add(mesh);
        }
      });
    }
  });
  svgGroup.scale.multiplyScalar(0.005);
  return svgGroup;
};
