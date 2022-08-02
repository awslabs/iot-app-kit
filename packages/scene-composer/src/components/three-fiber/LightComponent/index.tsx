import React, { useRef } from 'react';
import { DirectionalLightHelper, HemisphereLightHelper, PointLightHelper } from 'three';

import { LightType } from '../../../models/SceneModels';
import { ISceneNodeInternal, useEditorState, ILightComponentInternal } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { useEditorHelper } from '../../../hooks';
import { getComponentGroupName } from '../../../utils/objectThreeUtils';

import Light from './Light';

interface ILightComponentProps {
  node: ISceneNodeInternal;
  component: ILightComponentInternal;
}

function getLightHelper(lightType: LightType) {
  switch (lightType) {
    case 'Directional':
      return DirectionalLightHelper;
    case 'Hemisphere':
      return HemisphereLightHelper;
    case 'Point':
      return PointLightHelper;
    default:
      return undefined;
  }
}

const LightComponent: React.FC<ILightComponentProps> = ({ node, component }: ILightComponentProps) => {
  const sceneComposerId = useSceneComposerId();
  const lightRef = useRef<THREE.Object3D>(null!);
  const { isEditing } = useEditorState(sceneComposerId);

  const { lightSettings, lightType, type } = component;

  useEditorHelper(isEditing(), sceneComposerId, lightRef, getLightHelper(component.lightType));

  return (
    <group name={getComponentGroupName(node.ref, 'LIGHT')}>
      <Light ref={lightRef} lightSettings={lightSettings} lightType={lightType} type={type} />
    </group>
  );
};

export default LightComponent;
