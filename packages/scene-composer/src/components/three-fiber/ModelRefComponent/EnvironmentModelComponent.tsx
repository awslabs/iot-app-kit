import React from 'react';

import { IModelRefComponentInternal, ISceneNodeInternal, useEditorState } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';

import { GLTFModelComponent } from './GLTFModelComponent';

interface EnvironmentModelComponentProps {
  component: IModelRefComponentInternal;
  node: ISceneNodeInternal;
}

export const EnvironmentModelComponent: React.FC<EnvironmentModelComponentProps> = ({ node, component }) => {
  const sceneComposerId = useSceneComposerId();
  const { isEditing, cameraControlsType } = useEditorState(sceneComposerId);

  if (isEditing()) {
    return (
      <GLTFModelComponent
        key={component.ref}
        node={node}
        component={component}
        hiddenWhileImmersive={cameraControlsType === 'immersive'}
      />
    );
  }

  return <></>;
};
