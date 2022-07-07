import * as THREE from 'three';
import React, { useContext, useRef } from 'react';

import useLifecycleLogging from '../../logger/react-logger/hooks/useLifecycleLogging';
import { Component, LightType } from '../../SceneModels';
import { ISceneNodeInternal, useEditorState, ILightComponentInternal } from '../../store';
import { sceneComposerIdContext } from '../../sceneComposerIdContext';
import { useEditorHelper } from '../../hooks';
import { getComponentGroupName } from '../../utils/objectThreeUtils';

interface ILightComponentProps {
  node: ISceneNodeInternal;
  component: ILightComponentInternal;
}

function getLightHelper(lightType: LightType) {
  switch (lightType) {
    case 'Directional':
      return THREE.DirectionalLightHelper;
    case 'Hemisphere':
      return THREE.HemisphereLightHelper;
    case 'Point':
      return THREE.PointLightHelper;
    default:
      return undefined;
  }
}

// function createDirectionalLight(
//   ref: React.MutableRefObject<THREE.Object3D>,
//   lightComponent: ILightComponentInternal,
//   lightSettings: Scene.Component.IDirectionalLightSettings,
// ) {
//   const directionalLight = useMemo<THREE.DirectionalLight>(() => {
//     const light = new THREE.DirectionalLight(new THREE.Color(lightSettings.color), lightSettings.intensity);
//     light.castShadow = lightSettings.castShadow ?? true;
//     light.shadow.bias = 0;
//     light.shadow.camera.top = 10;
//     light.shadow.camera.bottom = 10;
//     light.shadow.camera.left = 10;
//     light.shadow.camera.right = 10;
//     light.shadow.camera.near = 0.1;
//     light.shadow.camera.far = 1000;
//     light.shadow.mapSize.width = 4 * 1024;
//     light.shadow.mapSize.height = 4 * 1024;
//     ref.current = light;
//     return light;
//   }, [lightSettings]);

//   return (
//     <React.Fragment>
//       <primitive object={directionalLight} />
//     </React.Fragment>
//   );
// }

function createDirectionalLight(
  ref: React.MutableRefObject<THREE.Object3D>,
  lightComponent: ILightComponentInternal,
  lightSettings: Component.IDirectionalLightSettings,
) {
  return (
    <directionalLight
      ref={ref}
      color={new THREE.Color(lightSettings.color)}
      intensity={lightSettings.intensity}
      castShadow={lightSettings.castShadow}
      // TODO: shadow camera, shadowmap and shadow bias greatly impacts the
      // shadow quality, we'll revisit how to best set these values in fine
      // tuning
      shadow-bias={0.0001}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-near={0.1}
      shadow-camera-far={1000}
      shadow-mapSize-height={1024 * 4}
      shadow-mapSize-width={1024 * 4}
    />
  );
}

function createPointLight(
  ref: React.MutableRefObject<THREE.Object3D>,
  lightComponent: ILightComponentInternal,
  lightSettings: Component.IPointLightSettings,
) {
  return (
    <pointLight
      ref={ref}
      color={new THREE.Color(lightSettings.color)}
      intensity={lightSettings.intensity}
      distance={lightSettings.distance}
      decay={lightSettings.decay}
      castShadow={lightSettings.castShadow}
      // TODO: shadow camera, shadowmap and shadow bias greatly impacts the
      // shadow quality, we'll revisit how to best set these values in fine
      // tuning
      shadow-bias={0.0001}
      shadow-camera-top={100}
      shadow-camera-bottom={-100}
      shadow-camera-left={-100}
      shadow-camera-right={100}
      shadow-camera-near={0.1}
      shadow-camera-far={1000}
      shadow-mapSize-height={1024 * 4}
      shadow-mapSize-width={1024 * 4}
    />
  );
}

function createHemisphereLight(
  ref: React.MutableRefObject<THREE.Object3D>,
  lightComponent: ILightComponentInternal,
  lightSettings: Component.IHemisphereLightSettings,
) {
  return (
    <hemisphereLight
      ref={ref}
      color={new THREE.Color(lightSettings.color)}
      groundColor={new THREE.Color(lightSettings.groundColor)}
      intensity={lightSettings.intensity}
    />
  );
}

function createAmbientLight(
  ref: React.MutableRefObject<THREE.Object3D>,
  lightComponent: ILightComponentInternal,
  lightSettings: Component.IAmbientLightSettings,
) {
  return <ambientLight ref={ref} color={new THREE.Color(lightSettings.color)} intensity={lightSettings.intensity} />;
}

function createLight(ref: React.MutableRefObject<THREE.Object3D>, lightComponent: ILightComponentInternal) {
  switch (lightComponent.lightType) {
    case 'Directional':
      return createDirectionalLight(
        ref,
        lightComponent,
        lightComponent.lightSettings as Component.IDirectionalLightSettings,
      );
    case 'Point':
      return createPointLight(ref, lightComponent, lightComponent.lightSettings as Component.IPointLightSettings);
    case 'Ambient':
      return createAmbientLight(ref, lightComponent, lightComponent.lightSettings as Component.IAmbientLightSettings);
    case 'Hemisphere':
      return createHemisphereLight(
        ref,
        lightComponent,
        lightComponent.lightSettings as Component.IHemisphereLightSettings,
      );
    default:
      return <React.Fragment></React.Fragment>;
  }
}

export const LightComponent: React.FC<ILightComponentProps> = ({ node, component }: ILightComponentProps) => {
  useLifecycleLogging(`LightComponent[${node.name}][${component.ref}]`);
  const lightComponent = component as ILightComponentInternal;
  const sceneComposerId = useContext(sceneComposerIdContext);
  const lightRef = useRef<THREE.Object3D>(null!);
  const { isEditing } = useEditorState(sceneComposerId);

  useEditorHelper(isEditing(), sceneComposerId, lightRef, getLightHelper(lightComponent.lightType));

  return <group name={getComponentGroupName(node.ref, 'LIGHT')}>{createLight(lightRef, lightComponent)}</group>;
};
