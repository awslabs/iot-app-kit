import { useCallback, useEffect, useRef } from 'react';

const useOverwriteRaycaster: (
  object: THREE.Object3D | undefined,
  raycaster?: () => void,
) => [() => void, () => void] = (object: THREE.Object3D | undefined, raycaster?: () => void) => {
  const originalRaycastMap = useRef({});

  useEffect(() => {
    if (object) {
      object.traverse((o: THREE.Object3D) => {
        originalRaycastMap.current[o.uuid] = o.raycast;
      });
    }
  }, [object]);

  const overwriteRaycaster = useCallback(() => {
    const raycastOverride = raycaster ? raycaster : () => {};
    if (object) {
      object.traverse((o: THREE.Object3D) => {
        o.raycast = raycastOverride;
      });
    }
  }, [object, raycaster]);

  const restoreRaycaster = useCallback(() => {
    if (object) {
      object.traverse((o: THREE.Object3D) => {
        o.raycast = originalRaycastMap.current[o.uuid];
      });
    }
  }, [object]);

  return [overwriteRaycaster, restoreRaycaster];
};

export default useOverwriteRaycaster;
