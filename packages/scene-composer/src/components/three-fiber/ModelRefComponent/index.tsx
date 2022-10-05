import React, { Fragment, useCallback } from 'react';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { ModelType } from '../../../models/SceneModels';
import { IModelRefComponentInternal, ISceneNodeInternal, useEditorState, useNodeErrorState } from '../../../store';
import LogProvider from '../../../logger/react-logger/log-provider';

import { TilesModelComponent } from './TilesModelComponent';
import { EnvironmentModelComponent } from './EnvironmentModelComponent';
import { ErrorModelComponent, GLTFModelComponent } from './GLTFModelComponent';

const ModelRefComponent = ({
  component,
  node,
}: {
  component: IModelRefComponentInternal;
  node: ISceneNodeInternal;
}) => {
  const sceneComposerId = useSceneComposerId();
  const { cameraControlsType } = useEditorState(sceneComposerId);
  const { addNodeError } = useNodeErrorState(sceneComposerId);

  const onError = useCallback(
    (error) => {
      addNodeError(node.ref, error);
    },
    [node],
  );

  if (component.modelType === ModelType.GLB || component.modelType === ModelType.GLTF) {
    return (
      <LogProvider namespace={'ModelRefComponent'} ErrorView={ErrorModelComponent} onError={onError}>
        <GLTFModelComponent
          key={component.ref}
          node={node}
          component={component}
          hiddenWhileImmersive={node.properties.hiddenWhileImmersive === true && cameraControlsType === 'immersive'}
        />
      </LogProvider>
    );
  } else if (component.modelType === ModelType.Environment) {
    return (
      <LogProvider namespace={'ModelRefComponent'} ErrorView={ErrorModelComponent} onError={onError}>
        <EnvironmentModelComponent node={node} component={component} />
      </LogProvider>
    );
  } else if (component.modelType === ModelType.Tiles3D) {
    return <TilesModelComponent key={component.ref} node={node} component={component as IModelRefComponentInternal} />;
  } else {
    return <Fragment key={component.ref}></Fragment>;
  }
};

export default ModelRefComponent;
