import type * as THREE from 'three';
import { type MutableRefObject, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

import { accessStore } from '../store';

type Helper = THREE.Object3D & {
  update: () => void;
};

/**
 * Create a Helper that respond to the state of the editor. For example, automatically
 * hide the helper when the editor is in loading state.
 *
 * @param isRendered - true if the SceneComposer is in editing mode, false otherwise
 * @param sceneComposerId - the Id of the SceneComposer instance
 * @param object3D - ref to the object that is the target of the Helper
 * @param proto - the constructor of the Helper class
 * @param args - args to be passed to the constructor
 * @returns
 */
export function useEditorHelper<T>(
  isRendered: boolean,
  sceneComposerId: string,
  object3D: MutableRefObject<THREE.Object3D | undefined>,
  proto: T,
  ...args: any[]
) {
  const helper = useRef<Helper>();

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (isRendered) {
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
  }, [isRendered, scene, proto, object3D, args]);

  accessStore(sceneComposerId).subscribe((state) => {
    if (helper.current) {
      helper.current.visible = !state.isLoadingModel;
    }
  });

  useFrame(() => {
    if (helper.current) {
      helper.current.update();
      if (object3D.current) {
        let isVisible = true;
        object3D.current?.traverseAncestors((ancestor) => (isVisible = isVisible && ancestor.visible));
        helper.current.visible = isVisible;
      }
    }
  });

  return helper;
}
