import React, { Fragment } from 'react';

import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { ModelType } from '../../../models/SceneModels';
import { IModelRefComponentInternal, ISceneNodeInternal, useEditorState } from '../../../store';

import { TilesModelComponent } from './TilesModelComponent';
import { GLTFModelComponent } from './GLTFModelComponent';

const ModelRefComponent = ({
  component,
  node,
}: {
  component: IModelRefComponentInternal;
  node: ISceneNodeInternal;
}) => {
  const sceneComposerId = useSceneComposerId();
  const { cameraControlsType } = useEditorState(sceneComposerId);

  if (component.modelType === ModelType.GLB || component.modelType === ModelType.GLTF) {
    return (
      <GLTFModelComponent
        key={component.ref}
        node={node}
        component={component}
        hiddenWhileImmersive={node.properties.hiddenWhileImmersive === true && cameraControlsType === 'immersive'}
      />
    );
  } else if (component.modelType === ModelType.Tiles3D) {
    return <TilesModelComponent key={component.ref} node={node} component={component as IModelRefComponentInternal} />;
  } else {
    return <Fragment key={component.ref}></Fragment>;
  }
};

export default ModelRefComponent;
