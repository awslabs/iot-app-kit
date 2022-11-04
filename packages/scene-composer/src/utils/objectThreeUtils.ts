import * as THREE from 'three';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';

import { IModelRefComponentInternal } from '../store';

export function getEntityGroupName(nodeRef: string) {
  return `ENTITY_GROUP_${nodeRef}`;
}

export function getComponentsGroupName(nodeRef: string) {
  return `ENTITY_GROUP_${nodeRef}_COMPONENTS`;
}

export function getChildrenGroupName(nodeRef: string) {
  return `ENTITY_GROUP_${nodeRef}_CHILDREN`;
}

export function getComponentGroupName(nodeRef: string, component: string) {
  return `${component}_COMPONENT_${nodeRef}`;
}

export function getBoundingBoxCorners(box: THREE.Box3) {
  const points = [
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ];

  points[0].set(box.min.x, box.min.y, box.min.z); // 000
  points[1].set(box.min.x, box.min.y, box.max.z); // 001
  points[2].set(box.min.x, box.max.y, box.min.z); // 010
  points[3].set(box.min.x, box.max.y, box.max.z); // 011
  points[4].set(box.max.x, box.min.y, box.min.z); // 100
  points[5].set(box.max.x, box.min.y, box.max.z); // 101
  points[6].set(box.max.x, box.max.y, box.min.z); // 110
  points[7].set(box.max.x, box.max.y, box.max.z); // 111

  return points;
}

export function cloneMaterials(obj: THREE.Object3D) {
  if (obj instanceof THREE.Mesh) {
    obj.material = obj.material.clone();
  }
}

export function acceleratedRaycasting(obj: THREE.Object3D) {
  if (obj instanceof THREE.Mesh) {
    const mesh = obj;
    mesh.raycast = acceleratedRaycast;
    const geometry: any = mesh.geometry;
    geometry.computeBoundsTree = computeBoundsTree;
    geometry.disposeBoundsTree = disposeBoundsTree;
    geometry.computeBoundsTree({ splitStrategy: 'CENTER' });
  }
}

export function enableShadow(component: IModelRefComponentInternal, obj: THREE.Object3D, maxAnisotropy: number) {
  if (obj instanceof THREE.Mesh) {
    obj.castShadow = component.castShadow ?? false;
    obj.receiveShadow = component.receiveShadow ?? false;
    if (obj.material.map) obj.material.map.anisotropy = Math.min(16, maxAnisotropy);
  }
}

export const resetObjectCenter = (obj: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(obj);
  box.getCenter(obj.position);
  obj.position.multiplyScalar(-1);
};

export const getSafeBoundingBox = (obj: THREE.Object3D): THREE.Box3 => {
  // TODO: When on latest ThreeJS replace this with new THREE.Box3().setFromObject(obj, true);
  const fullBoundingBox = new THREE.Box3().setFromObject(obj);
  // Because LineSegments have absurd sizes in ThreeJS we need to account for these in the scene and ignore them.
  // Map all Line Segments to their parent for re-parenting
  const lineMap: Map<THREE.Object3D, THREE.Object3D> = new Map<THREE.Object3D, THREE.Object3D>();
  obj.traverse((child) => {
    if ((child as THREE.LineSegments).isLineSegments) {
      if (child.parent) {
        lineMap.set(child.parent, child);
      }
    }
  });

  // Severe the connection
  lineMap.forEach((line) => {
    line.removeFromParent();
  });

  const safeBoundingBox = new THREE.Box3().setFromObject(obj);

  // Re-connect
  lineMap.forEach((line, parent) => {
    parent.add(line);
  });
  return safeBoundingBox;
};
