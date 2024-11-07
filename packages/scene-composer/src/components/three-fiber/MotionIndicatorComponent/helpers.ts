import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { Component, type Vector3 } from '../../../models/SceneModels';
import { getDataUri } from '../../../utils/svgUtils';

const arrowSvg = `
<svg width="150" height="150" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.96824 20.5L32.0635 20.5" stroke="white" stroke-width="4" stroke-linejoin="round"/>
  <path d="M23.6984 29L32.0635 20.5L23.6984 12" stroke="white" stroke-width="4" stroke-linejoin="round"/>
</svg>
`;
const arrow = getDataUri(arrowSvg);

/**
 * Calculate the number of repeated arrows in x direction based on number of repeat in y, so that the
 * arrow will not be stretched.
 *
 * The texture is assumed to be 1x1 size.
 *
 * x is the direction of the arrow motion, y is perpendicular to
 * x direction and not related to the coordinate system.
 *
 * @param yRepeat number of repeated arrows in y direction of the texture
 * @param scale the scale of the indicator mesh object for [x, y, z] axis
 * @param shape the shape of the indicator
 * @returns the number of repeated textures in x direction.
 */
export function getNumOfRepeatInX(yRepeat: number, scale: Vector3, shape: Component.MotionIndicatorShape) {
  switch (shape) {
    // LinearPlane is default to on xz plane and move along x axis.
    // Use textureSize = xRepeat / xLength = yRepeat / zLength to calculate xRepeat
    case Component.MotionIndicatorShape.LinearPlane:
      return (yRepeat / scale[2]) * scale[0];
    // LinearCylinder is a tube default to move along x axis. textureSize = xRepeat / xLength = yRepeat / perimeter of the tube
    case Component.MotionIndicatorShape.LinearCylinder:
      // yRepeat / Perimeter of ellipse * scale[0]
      return (
        (yRepeat / (2 * Math.PI * Math.sqrt(((scale[1] * scale[1]) / 4 + (scale[2] * scale[2]) / 4) / 2))) * scale[0]
      );
    // CircularCylinder is a ring default to move in a circle on xz-plane.
    // Use textureSize = xRepeat / xLength = yRepeat / yLength
    case Component.MotionIndicatorShape.CircularCylinder:
      // Perimeter of ellips * yRepeat / scale[1], round to nearest positive integer so that there will be no partial arrows.
      return Math.max(
        Math.round(
          (2 * Math.PI * Math.sqrt(((scale[0] * scale[0]) / 4 + (scale[2] * scale[2]) / 4) / 2) * yRepeat) / scale[1],
        ),
        1,
      );
    default:
      return yRepeat;
  }
}

export const getWorldMatrixScale = (
  shape: Component.MotionIndicatorShape,
  defaultScale: Vector3,
  mesh?: THREE.Object3D,
): Vector3 => {
  if (mesh) {
    const scale = new THREE.Vector3();

    mesh.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), scale);

    if (shape === Component.MotionIndicatorShape.LinearCylinder) {
      // LinearCylinder has a default 90 degree rotation in z, so scale for x and y should be switched.
      return [Math.abs(scale.y), Math.abs(scale.x), Math.abs(scale.z)];
    } else if (shape === Component.MotionIndicatorShape.LinearPlane) {
      // Scale decomposed for Plane is in x and y, so use scale.y as scale.z to match the coordinates with others.
      return [Math.abs(scale.x), 1, Math.abs(scale.y)];
    }

    return [Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z)];
  } else {
    return defaultScale;
  }
};

export function useArrowTexture(props: {
  scale: Vector3;
  numOfRepeatInY: number;
  speed: number;
  shape: Component.MotionIndicatorShape;
  objRef: any;
}) {
  const texture = useRef(useLoader(THREE.TextureLoader, arrow).clone());

  useEffect(() => {
    // needsUpdate after clone
    texture.current.needsUpdate = true;
    texture.current.wrapS = THREE.RepeatWrapping;
    texture.current.wrapT = THREE.RepeatWrapping;

    texture.current.offset.x = 0;
    texture.current.offset.y = 0;
  }, []);

  // Update the number of repeated textures when changed
  useEffect(() => {
    texture.current?.repeat.setY(props.numOfRepeatInY);
    texture.current?.repeat.setX(
      getNumOfRepeatInX(
        props.numOfRepeatInY,
        getWorldMatrixScale(props.shape, props.scale, props.objRef.current),
        props.shape,
      ),
    );
  }, [props.numOfRepeatInY, props.objRef.current, props.shape, props.scale]);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    if (texture.current) {
      const worldScale = getWorldMatrixScale(props.shape, props.scale, props.objRef.current);
      texture.current?.repeat.setX(getNumOfRepeatInX(props.numOfRepeatInY, worldScale, props.shape));

      texture.current.offset.x = (-props.speed * elapsedTime * texture.current.repeat.x) / worldScale[0];
    }
  });

  return texture;
}
