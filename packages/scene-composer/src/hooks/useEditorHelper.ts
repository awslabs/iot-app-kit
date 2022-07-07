import * as THREE from 'three';
import { MutableRefObject, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

import { useStore } from '../store';

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

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (isEditing) {
      if (proto && object3D.current) {
        helper.current = new (proto as any)(object3D.current, ...args);
        if (helper.current) {
          scene.add(helper.current);
        }
      }
    }

    return () => {
      if (helper.current) {
        scene.remove(helper.current);
      }
    };
  }, [isEditing, scene, proto, object3D, args]);

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
