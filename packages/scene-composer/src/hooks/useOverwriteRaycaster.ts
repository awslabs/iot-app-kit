import { useCallback } from 'react';

const useOverwriteRaycaster: (object: THREE.Object3D, raycaster?: () => void) => () => void = (
  object: THREE.Object3D,
  raycaster?: () => void,
) => {
  const overwriteRaycaster = useCallback(() => {
    const raycastOverride = raycaster ? raycaster : () => {};
    object.traverse((object: THREE.Object3D) => {
      object.raycast = raycastOverride;
    });
  }, [object]);

  return overwriteRaycaster;
};

export default useOverwriteRaycaster;
