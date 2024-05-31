import { useCallback, useMemo } from 'react';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { useEditorState, accessStore } from '../store';

const useSelectedNode = () => {
  const sceneComposerId = useSceneComposerId();
  const {
    selectedSceneNodeRef,
    selectedSceneSubmodelRef,
    getObject3DBySceneNodeRef,
    setSelectedSceneNodeRef,
    setSelectedSceneSubmodelRef,
  } = useEditorState(sceneComposerId);

  const getSceneNodeByRef = accessStore(sceneComposerId)((state) => state.getSceneNodeByRef);

  const selectedSceneNode = useMemo(
    () => getSceneNodeByRef(selectedSceneNodeRef),
    [selectedSceneNodeRef, getSceneNodeByRef],
  );

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
  }, [selectedSceneSubmodelRef, getSelectedObject]);

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
