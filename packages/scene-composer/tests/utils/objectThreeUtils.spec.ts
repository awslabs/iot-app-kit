/* eslint-disable */
const mockAcceleratedRaycast = jest.fn();
jest.doMock('three-mesh-bvh', () => {
  const originalModule = jest.requireActual('three-mesh-bvh');
  return {
    ...originalModule,
    acceleratedRaycast: mockAcceleratedRaycast
  };
});

import * as THREE from 'three';
import { KnownComponentType } from '../../src/interfaces';
import { IModelRefComponentInternal } from '../../src/store';

import {
  acceleratedRaycasting,
  cloneMaterials,
  enableShadow,
  getBoundingBoxCorners,
  getChildrenGroupName,
  getComponentGroupName,
  getComponentsGroupName,
  getEntityGroupName,
} from '../../src/utils/objectThreeUtils';

/* eslint-enable */

const ENTITY_GROUP_PREFIX = 'ENTITY_GROUP_';
const COMPONENTS_SUFFIX = '_COMPONENTS';
const COMPONENT = '_COMPONENT_';
const CHILDREN_SUFFIX = '_CHILDREN';
const nodeRef = 'testNodeRef';

describe('objectThreeUtils', () => {
  const baseComponent: IModelRefComponentInternal = {
    ref: 'mock-comp',
    type: KnownComponentType.ModelRef,
    uri: 'mock/uri',
    modelType: 'GLB',
  };

  it('should generate the expected string when calling getEntityGroupName', () => {
    expect(getEntityGroupName(nodeRef)).toEqual(ENTITY_GROUP_PREFIX + nodeRef);
  });

  it('should generate the expected string when calling getComponentsGroupName', () => {
    expect(getComponentsGroupName(nodeRef)).toEqual(ENTITY_GROUP_PREFIX + nodeRef + COMPONENTS_SUFFIX);
  });

  it('should generate the expected string when calling getChildrenGroupName', () => {
    expect(getChildrenGroupName(nodeRef)).toEqual(ENTITY_GROUP_PREFIX + nodeRef + CHILDREN_SUFFIX);
  });

  it('should generate the expected string when calling getComponentGroupName', () => {
    expect(getComponentGroupName(nodeRef, 'testComponent')).toEqual('testComponent' + COMPONENT + nodeRef);
  });

  it('should extract the bounding box corners from THREE.Box3 when calling getBoundingBoxCorners', () => {
    const box = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
    const expectedPoints = [
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(-1, -1, 1),
      new THREE.Vector3(-1, 1, -1),
      new THREE.Vector3(-1, 1, 1),
      new THREE.Vector3(1, -1, -1),
      new THREE.Vector3(1, -1, 1),
      new THREE.Vector3(1, 1, -1),
      new THREE.Vector3(1, 1, 1),
    ];
    expect(getBoundingBoxCorners(box)).toEqual(expectedPoints);
  });

  it('should clone mesh object', () => {
    const object = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    const cloneSpy = jest.spyOn(object.material, 'clone');

    cloneMaterials(object);

    expect(cloneSpy).toBeCalled();
  });

  it('should use acceleratedRaycast', () => {
    const object = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), new THREE.MeshBasicMaterial({ color: 0xffff00 }));

    acceleratedRaycasting(object);

    expect(object.raycast).toBe(mockAcceleratedRaycast);
  });

  it('should not enable shadow', () => {
    const texture = new THREE.DataTexture(new Uint8Array(3), 2, 2, THREE.RGBFormat);
    const object = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), new THREE.MeshBasicMaterial({ map: texture }));

    enableShadow(baseComponent, object, 1);

    expect(object.castShadow).toBeFalsy();
    expect(object.receiveShadow).toBeFalsy();
    expect(object.material.map?.anisotropy).toEqual(1);
  });

  it('should enable shadow', () => {
    const texture = new THREE.DataTexture(new Uint8Array(3), 2, 2, THREE.RGBFormat);
    const object = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), new THREE.MeshBasicMaterial({ map: texture }));

    enableShadow({ ...baseComponent, castShadow: true, receiveShadow: true }, object, 20);

    expect(object.castShadow).toBeTruthy();
    expect(object.receiveShadow).toBeTruthy();
    expect(object.material.map?.anisotropy).toEqual(16);
  });
});
