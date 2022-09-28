import { useCallback, useMemo } from 'react';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { useEditorState, useStore } from '../store';

const useSelectedNode = () => {
  const sceneComposerId = useSceneComposerId();
  const {
    selectedSceneNodeRef,
    selectedSceneSubmodelRef,
    getObject3DBySceneNodeRef,
    setSelectedSceneNodeRef,
    setSelectedSceneSubmodelRef,
  } = useEditorState(sceneComposerId);

  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);

  const selectedSceneNode = useMemo(() => getSceneNodeByRef(selectedSceneNodeRef), [selectedSceneNodeRef]);

  // callback, not memo because this object could be very large, and we want to avoid creating multiple copies in memory
  const getSelectedObject = useCallback(() => {
    return getObject3DBySceneNodeRef(selectedSceneNodeRef);
  }, [selectedSceneNodeRef, getObject3DBySceneNodeRef]);

  const getSelectedSubmodel = useCallback(() => {
    const object3D = getSelectedObject();

    if (object3D) {
      if (typeof selectedSceneSubmodelRef === 'number') {
        return object3D.getObjectById(Number(selectedSceneSubmodelRef));
      }

      return object3D.getObjectByName(selectedSceneSubmodelRef as string);
    }
  }, [selectedSceneSubmodelRef]);

  return {
    selectedSceneNodeRef,
    selectedSceneNode,
    setSelectedSceneNodeRef,
    selectedSceneSubmodelRef,
    setSelectedSceneSubmodelRef,
    getSelectedObject,
    getSelectedSubmodel,
  };
};

export default useSelectedNode;
