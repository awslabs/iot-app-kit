import { useCallback, useEffect, useReducer } from 'react';
import { type Object3D, Mesh } from 'three';

import {
  type MaterialMapLayer,
  addMaterial,
  backUpOriginalMaterial,
  initialMaterialMaps,
  materialReducer,
  removeMaterial,
} from '../reducers/materialReducer';

const useMaterialEffect = (
  callback: (object: Object3D) => THREE.Material | null,
  layer: MaterialMapLayer,
  object?: Object3D,
) => {
  const [materialMaps, dispatch] = useReducer(materialReducer, initialMaterialMaps);

  const restore = useCallback(() => {
    object?.traverse((o) => {
      if (o instanceof Mesh && o.userData?.isOriginal) {
        removeMaterial(o, layer, materialMaps, dispatch);
      }
    });
  }, [object, layer]);

  useEffect(() => {
    object?.traverse((o) => {
      if (o instanceof Mesh && !materialMaps.original[o.uuid]) {
        backUpOriginalMaterial(o, materialMaps, dispatch);
      }
    });
  }, [object]);

  const transform = () => {
    // Currently can't think of a use case where we'd want to use this to transform a material on a component we own
    // isOriginal could be an argument in the future.
    object?.traverse((o) => {
      if (o.userData?.isOriginal && o instanceof Mesh) {
        const newMaterial = callback(o);
        if (newMaterial) {
          // @ts-expect-error type mistmatch after upgrade
          addMaterial(o, newMaterial, layer, materialMaps, dispatch);
        }
      }
    });
  };

  return [transform, restore];
};

export default useMaterialEffect;
