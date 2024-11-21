import { useRef } from 'react';
import { DirectionalLightHelper, HemisphereLightHelper, PointLightHelper } from 'three';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { useEditorHelper } from '../../../hooks';
import { type LightType } from '../../../models/SceneModels';
import { useEditorState, type ILightComponentInternal, type ISceneNodeInternal } from '../../../store';
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
  const lightRef = useRef<THREE.Light>(null!);
  const { isEditing } = useEditorState(sceneComposerId);

  const { lightSettings, lightType, type } = component;

  // @ts-expect-error type mismatch after update
  useEditorHelper(isEditing(), sceneComposerId, lightRef, getLightHelper(component.lightType));

  return (
    <group name={getComponentGroupName(node.ref, 'LIGHT')}>
      {/* @ts-expect-error type mismatch after update */}
      <Light ref={lightRef} lightSettings={lightSettings} lightType={lightType} type={type} />
    </group>
  );
};

export default LightComponent;
