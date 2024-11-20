import { renderHook } from '@testing-library/react';
import * as THREE from 'three';

import useOverwriteRaycaster from './useOverwriteRaycaster';

describe('useOverwriteRaycaster', () => {
  const raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0).normalize());

  const boxSize = 1;
  const position = new THREE.Vector3(2, 0, 0);
  const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('it overwrite the raycaster for all objects with custom no op function', () => {
    const parentCube = new THREE.Mesh(geometry, material);
    parentCube.translateX(position.x);
    parentCube.translateY(position.y);
    parentCube.translateZ(position.z);
    parentCube.updateMatrixWorld();
    const cube2 = new THREE.Mesh(geometry, material);
    cube2.translateX(position.x + 1);
    cube2.translateY(position.y);
    cube2.translateZ(position.z);
    parentCube.add(cube2);
    cube2.updateMatrixWorld();

    const intersectObjects = raycaster.intersectObjects([parentCube]);
    //hit each cube on enter and leave
    expect(intersectObjects.length).toBe(4);

    const mockRaycaster = vi.fn();
    const [overwriteRayCaster, restoreRaycaster] = renderHook(() => useOverwriteRaycaster(parentCube, mockRaycaster))
      .result.current;
    overwriteRayCaster();
    const intersectObjects2 = raycaster.intersectObjects([parentCube]);

    expect(mockRaycaster).toBeCalledTimes(2);
    expect(intersectObjects2.length).toBe(0);

    restoreRaycaster();
    const intersectObjects3 = raycaster.intersectObjects([parentCube]);

    expect(mockRaycaster).toBeCalledTimes(2);
    expect(intersectObjects3.length).toBe(4);
  });

  it('it overwrite the raycaster for all objects with default no op function', () => {
    const parentCube = new THREE.Mesh(geometry, material);
    parentCube.translateX(position.x);
    parentCube.translateY(position.y);
    parentCube.translateZ(position.z);
    parentCube.updateMatrixWorld();
    const cube2 = new THREE.Mesh(geometry, material);
    cube2.translateX(position.x + 1);
    cube2.translateY(position.y);
    cube2.translateZ(position.z);
    parentCube.add(cube2);
    cube2.updateMatrixWorld();

    const intersectObjects = raycaster.intersectObjects([parentCube]);
    //hit each cube on enter and leave
    expect(intersectObjects.length).toBe(4);

    const [overwriteRayCaster, restoreRaycaster] = renderHook(() => useOverwriteRaycaster(parentCube)).result.current;
    overwriteRayCaster();
    const intersectObjects2 = raycaster.intersectObjects([parentCube]);
    expect(intersectObjects2.length).toBe(0);

    restoreRaycaster();
    const intersectObjects3 = raycaster.intersectObjects([parentCube]);
    expect(intersectObjects3.length).toBe(4);
  });

  it('call restore first should keep previous raycast', () => {
    const parentCube = new THREE.Mesh(geometry, material);
    parentCube.translateX(position.x);
    parentCube.translateY(position.y);
    parentCube.translateZ(position.z);
    parentCube.updateMatrixWorld();
    const cube2 = new THREE.Mesh(geometry, material);
    cube2.translateX(position.x + 1);
    cube2.translateY(position.y);
    cube2.translateZ(position.z);
    parentCube.add(cube2);
    cube2.updateMatrixWorld();

    const mockRaycaster = vi.fn();
    const restoreRaycaster = renderHook(() => useOverwriteRaycaster(parentCube, mockRaycaster)).result.current[1];

    const intersectObjects = raycaster.intersectObjects([parentCube]);
    //hit each cube on enter and leave
    expect(intersectObjects.length).toBe(4);

    restoreRaycaster();
    const intersectObjects2 = raycaster.intersectObjects([parentCube]);
    expect(intersectObjects2.length).toBe(4);

    expect(mockRaycaster).toBeCalledTimes(0);
  });
});
