import { useContext } from 'react';

import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import ConvertSceneModal from '../components/modals/ConvertSceneModal';
import DeleteComponentModal from '../components/modals/DeleteComponentModal';
import DeleteNodeModal from '../components/modals/DeleteNodeModal';
import MessageModal from '../components/modals/MessageModal';
import { accessStore } from '../store';

const useSceneModal = (): React.JSX.Element | null => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const messages = accessStore(sceneComposerId)((state) => state.getMessages());
  const isViewing = accessStore(sceneComposerId)((state) => state.isViewing());

  const convertSceneModalVisible = accessStore(sceneComposerId)((state) => !!state.convertSceneModalVisible);
  const deleteConfirmationModalVisible = accessStore(sceneComposerId)(
    (state) => !!state.deleteConfirmationModalVisible,
  );
  const deleteConfirmationModalVisibleParams = accessStore(sceneComposerId)(
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
