import * as THREE from 'three';
import { MutableRefObject, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { useStore } from '../store';
import { getFinalTransform } from '../utils/nodeUtils';

type Helper = THREE.Object3D & {
  update: () => void;
};

/**
 * Create a Helper that respond to the state of the editor. For example, automatically
 * hide the helper when the editor is in loading state.
 *
 * @param isEditing - true if the SceneComposer is in editing mode, false otherwise
 * @param sceneComposerId - the Id of the SceneComposer instance
 * @param object3D - ref to the object that is the target of the Helper
 * @param proto - the constructor of the Helper class
 * @param args - args to be passed to the constructor
 * @returns
 */
export function useEditorHelper<T>(
  isEditing: boolean,
  sceneComposerId: string,
  object3D: MutableRefObject<THREE.Object3D | undefined>,
  proto: T,
  ...args: any[]
) {
  const helper = useRef<Helper>();

  useEffect(() => {
    if (isEditing) {
      if (proto && object3D.current) {
        helper.current = new (proto as any)(object3D.current, ...args);

        if (helper.current) {
          const helperTransform = {
            position: helper.current.position.clone(),
            rotation: helper.current.rotation.clone(),
            scale: helper.current.scale.clone(),
          };
          const finalTransform = getFinalTransform(helperTransform, object3D.current);
          const group = new THREE.Group();
          group.add(helper.current);
          group.position.copy(finalTransform.position);
          group.rotation.copy(finalTransform.rotation);
          group.scale.copy(finalTransform.scale);
          object3D.current.add(group);
        }
      }
    }

    return () => {
      if (helper.current?.parent) {
        object3D.current?.remove(helper.current.parent);
      }
    };
  }, [isEditing, proto, object3D, args]);

  useStore(sceneComposerId).subscribe((state) => {
    if (helper.current) {
      helper.current.visible = !state.isLoadingModel;
    }
  });

  useFrame(() => {
    if (helper.current) {
      helper.current.update();
    }
  });

  return helper;
}
