import React, { Fragment } from 'react';
import * as THREE from 'three';
import {  useFrame } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGLTF } from '../ModelRefComponent/GLTFLoader';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { ISceneNodeInternal, useEditorState, useViewOptionState } from '../../../store';

import { IAnimationComponent } from '../../../interfaces';

function pauseAnimation(gltfModel, AnimationMixer, isPaused, AnimationList){
  try{
    AnimationList.forEach( function ( clip ) {
      const animation = THREE.AnimationClip.findByName( gltfModel, clip );
      AnimationMixer.clipAction(animation).paused = isPaused
    } );    
  }
  catch (error) {
   // console.error(error);
  }
}

function Animate(gltfModel, AnimationMixer, AnimationList){
  try{
    AnimationList.forEach( function ( clip ) {
      const animation = THREE.AnimationClip.findByName( gltfModel, clip );
      AnimationMixer.clipAction(animation).play();
    } );
  }
  catch (error) {
    //console.log(error)
  }
    useFrame((state, delta) => { 
    AnimationMixer?.update(delta)
  });
}
export const isPaused = false;

export function getClip(uri){
  const gltf = useGLTF(
    uri,
  ) as GLTF;
  return gltf.animations
}
const AnimationComponent = ({ component, node }: { component: IAnimationComponent; node: ISceneNodeInternal }) => {
  try{
  const sceneComposerId = useSceneComposerId();
  const isGlobalAnimationPaused = (!useViewOptionState(sceneComposerId).componentVisibilities["Animation"]);
  const { getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const object = getObject3DBySceneNodeRef(node.ref);
  let gltf
  if(component.uri){
   gltf = useGLTF(
      component?.uri,
  ) as GLTF;
  }
  let AnimationMixer

  if(object){
    const obj = object
    AnimationMixer = new THREE.AnimationMixer(obj);
  }
  if(gltf){
    pauseAnimation(gltf, AnimationMixer, isGlobalAnimationPaused, component.currentAnimations)
    Animate(gltf, AnimationMixer, component.currentAnimations)
  }
  }
  catch(error){
    //console.log(error)
  }
  return <Fragment/>;
};

AnimationComponent.displayName = 'AnimationComponent';

export default AnimationComponent;