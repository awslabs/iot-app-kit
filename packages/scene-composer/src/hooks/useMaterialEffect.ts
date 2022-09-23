import { useRef, useCallback, useEffect } from 'react';
import { Object3D, Mesh } from 'three';

const useMaterialEffect = (callback: (object: Object3D) => void, object?: Object3D) => {
  const originalMaterialMap = useRef({});

  const restore = useCallback(() => {
    object?.traverse((o) => {
      if (o instanceof Mesh) {
        const original = originalMaterialMap.current[o.uuid];
        o.material = original.clone();
      }
    });
  }, []);

  useEffect(() => {
    object?.traverse((o) => {
      if (o instanceof Mesh) {
        if (!originalMaterialMap.current[o.uuid]) {
          originalMaterialMap.current[o.uuid] = o.material.clone();
        }
      }
    });
  }, []);

  const transform = () => {
    // Currently can't think of a use case where we'd want to use this to transform a material on a component we own
    // isOriginal could be an argument in the future.
    object?.traverse((o) => o.userData?.isOriginal && callback(o));
  };

  return [transform, restore];
};

export default useMaterialEffect;
