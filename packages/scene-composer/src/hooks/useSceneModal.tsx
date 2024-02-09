import React, { useContext } from 'react';

import MessageModal from '../components/modals/MessageModal';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { useStore } from '../store';
import ConvertSceneModal from '../components/modals/ConvertSceneModal';
import DeleteNodeModal from '../components/modals/DeleteNodeModal';
import DeleteComponentModal from '../components/modals/DeleteComponentModal';

const useSceneModal = (): React.JSX.Element | null => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const messages = useStore(sceneComposerId)((state) => state.getMessages());
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());

  const convertSceneModalVisible = useStore(sceneComposerId)((state) => !!state.convertSceneModalVisible);
  const deleteConfirmationModalVisible = useStore(sceneComposerId)((state) => !!state.deleteConfirmationModalVisible);
  const deleteConfirmationModalVisibleParams = useStore(sceneComposerId)(
    (state) => state.deleteConfirmationModalParams,
  );

  const showMessageModal = messages.length > 0;

  if (convertSceneModalVisible && !isViewing) {
    return <ConvertSceneModal />;
  }

  if (showMessageModal) {
    return <MessageModal />;
  }

  if (deleteConfirmationModalVisible) {
    if (deleteConfirmationModalVisibleParams?.type === 'deleteNode') {
      return <DeleteNodeModal />;
    } else if (deleteConfirmationModalVisibleParams?.type === 'deleteComponent') {
      return <DeleteComponentModal />;
    }
  }

  return null;
};

export default useSceneModal;
