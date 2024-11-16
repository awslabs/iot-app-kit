// eslint-disable-next-line import/default
import { useFrame } from '@react-three/fiber';
import { Fragment, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { type IAnimationComponent } from '../../../interfaces';
import { type ISceneNodeInternal, useEditorState, useViewOptionState } from '../../../store';

export const toggleIsAnimationPaused = (
  AnimationMixer: THREE.AnimationMixer,
  isPaused: boolean,
  AnimationList: string[],
) => {
  const object = AnimationMixer.getRoot() as THREE.Object3D;
  AnimationList.forEach(function (clip) {
    const animation = THREE.AnimationClip.findByName(object.animations, clip);
    if (AnimationMixer.clipAction(animation)) {
      AnimationMixer.clipAction(animation).paused = isPaused;
    }
  });
};

interface AnimationComponentProps {
  component: IAnimationComponent;
  node: ISceneNodeInternal;
}
export const animationObjectKey = 'Scene';
const AnimationComponent: React.FC<AnimationComponentProps> = ({ component, node }) => {
  const sceneComposerId = useSceneComposerId();
  const isGlobalAnimationPaused = !useViewOptionState(sceneComposerId).componentVisibilities['Animation'];
  const [scene, setScene] = useState<THREE.Object3D>();
  const { getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const object = getObject3DBySceneNodeRef(node.ref);
  const currentAnimations = useMemo(() => {
    const currentAnimations: string[] = [];
    if (object) {
      // gltf loader sets this name for the object 3ds it loads
      setScene(object.getObjectByName(animationObjectKey));
      component.currentAnimations?.forEach((animation) => {
        currentAnimations.push(animation);
      });
    }
    return currentAnimations;
  }, [object, component]);

  const AnimationMixer = useMemo(() => {
    let AnimationMixer;
    if (scene) {
      AnimationMixer = new THREE.AnimationMixer(scene);
    }
    return AnimationMixer;
  }, [object, scene, component, node]);

  useEffect(() => {
    if (scene?.animations) {
      currentAnimations.forEach((clip) => {
        const animation = THREE.AnimationClip.findByName(scene.animations, clip);
        AnimationMixer.clipAction(animation)?.play();
      });
      toggleIsAnimationPaused(AnimationMixer, isGlobalAnimationPaused, currentAnimations);
    }
  }, [scene, isGlobalAnimationPaused, currentAnimations, component, AnimationMixer]);
  useFrame((state, delta) => {
    AnimationMixer?.update(delta);
  });
  return <Fragment />;
};

AnimationComponent.displayName = 'AnimationComponent';

export default AnimationComponent;
