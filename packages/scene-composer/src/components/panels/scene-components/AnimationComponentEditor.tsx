import { useCallback, useContext } from 'react';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { accessStore, type IAnimationComponentInternal, type ISceneNodeInternal } from '../../../store';

import { AnimationViewStateEditor } from './AnimationViewStateEditor';

export type AnimationEditorProps = {
  node: ISceneNodeInternal;
  component: IAnimationComponentInternal;
};

export const AnimationComponentEditor: React.FC<AnimationEditorProps> = ({ ...props }) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = accessStore(sceneComposerId)((state) => state.updateComponentInternal);
  // istanbul ignore next
  const onUpdate = useCallback(
    (currentAnimations, noderef, component) => {
      updateComponentInternal(noderef, { ...component, currentAnimations });
    },
    [updateComponentInternal],
  );

  return <AnimationViewStateEditor {...props} onUpdate={onUpdate} />;
};
