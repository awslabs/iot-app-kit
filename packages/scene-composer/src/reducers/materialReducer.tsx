import * as THREE from 'three';

export type MaterialMapLayer = 'original' | 'rules' | 'highlights' | 'subModel';
export type MaterialMapActions = 'add' | 'remove';

interface IMaterialMapsState {
  original: Record<string, THREE.Material>;
  rules: Record<string, THREE.Material>;
  highlights: Record<string, THREE.Material>;
  subModel: Record<string, THREE.Material>;
}

interface MaterialMapAction {
  objectId: string;
  type: MaterialMapActions;
  layer: MaterialMapLayer;
  material?: THREE.Material;
}

export const materialReducer = (materialMaps: IMaterialMapsState, action: MaterialMapAction): IMaterialMapsState => {
  switch (action.type) {
    case 'add': {
      const newMaps = materialMaps;
      if (action.material) {
        newMaps[action.layer][action.objectId] = action.material;
      }
      return newMaps;
    }
    case 'remove': {
      const newMaps = materialMaps;
      const newMap = {};
      for (const key in materialMaps[action.layer]) {
        if (key != action.objectId) {
          newMap[action.objectId] = materialMaps[action.layer][action.objectId];
        }
      }
      newMaps[action.layer] = newMap;
      return newMaps;
    }
    /* istanbul ignore next */
    default: {
      throw Error('Unknown material action: ' + action.type);
    }
  }
};

export const initialMaterialMaps: IMaterialMapsState = {
  original: {},
  rules: {},
  highlights: {},
  subModel: {},
};

export const removeMaterial = (
  obj: THREE.Object3D,
  layer: MaterialMapLayer,
  materialMaps: IMaterialMapsState,
  dispatch: React.Dispatch<MaterialMapAction>,
): void => {
  if (obj instanceof THREE.Mesh) {
    dispatch({
      objectId: obj.uuid,
      type: 'remove',
      layer: layer,
    });
    //restore with priority here
    switch (layer) {
      case 'rules':
      case 'subModel':
        if (materialMaps.highlights[obj.uuid]) {
          obj.material = materialMaps.highlights[obj.uuid].clone();
        } else {
          obj.material = materialMaps.original[obj.uuid].clone();
        }
        break;
      case 'highlights':
        // if no rule being applied then revert to original
        if (!materialMaps.rules[obj.uuid]) {
          obj.material = materialMaps.original[obj.uuid].clone();
        }
        break;
      /* istanbul ignore next */
      case 'original':
        break;
      /* istanbul ignore next */
      default: {
        throw Error('Unsupported material layer restore: ' + layer);
      }
    }
  }
};

export const addMaterial = (
  obj: THREE.Object3D,
  newMaterial: THREE.Material,
  layer: MaterialMapLayer,
  materialMaps: IMaterialMapsState,
  dispatch: React.Dispatch<MaterialMapAction>,
): void => {
  if (obj instanceof THREE.Mesh) {
    dispatch({
      objectId: obj.uuid,
      type: 'add',
      layer: layer,
      material: newMaterial,
    });
    //apply priority here
    switch (layer) {
      case 'rules':
      case 'subModel':
        obj.material = newMaterial.clone();
        break;
      case 'highlights':
        if (!materialMaps.rules[obj.uuid]) {
          obj.material = newMaterial.clone();
        }
        break;
      case 'original':
        // just backing up the original
        break;
      /* istanbul ignore next */
      default: {
        throw Error('Unsupported material layer transform: ' + layer);
      }
    }
  }
};

export const backUpOriginalMaterial = (
  obj: THREE.Object3D,
  materialMaps: IMaterialMapsState,
  dispatch: React.Dispatch<MaterialMapAction>,
): void => {
  if (obj instanceof THREE.Mesh && !materialMaps.original[obj.uuid]) {
    addMaterial(obj, obj.material.clone(), 'original', materialMaps, dispatch);
  }
};
