import * as THREE from 'three';

import { type MeshStyle } from '../interfaces';

export const createMaterialFromStyle = (obj: THREE.Object3D, style: MeshStyle): THREE.Material | null => {
  if (obj instanceof THREE.Mesh) {
    const newMaterial: THREE.Material = obj.material.clone();
    //const style = obj.userData.appliedStyle as MeshStyle;
    if (style.transparent) {
      if (!newMaterial.transparent) {
        newMaterial.transparent = true;
        // need recompile shader
        newMaterial.needsUpdate = true;
      }
      // material may already be transparent, multiply the opacity
      newMaterial.opacity = newMaterial.opacity * (style.opacity ?? 1.0);
    }

    if (style.color && 'color' in newMaterial) {
      newMaterial.color = new THREE.Color(style.color);
    }
    return newMaterial;
  }
  return null;
};
