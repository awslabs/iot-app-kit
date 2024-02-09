import React, { useContext } from 'react';

import MessageModal from '../components/modals/MessageModal';
import { sceneComposerIdContext } from '../common/sceneComposerIdContext';
import { useStore } from '../store';
import ConvertSceneModal from '../components/modals/ConvertSceneModal';

const useSceneModal = (): React.JSX.Element | null => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const messages = useStore(sceneComposerId)((state) => state.getMessages());
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());

  const convertSceneModalVisible = useStore(sceneComposerId)((state) => !!state.convertSceneModalVisible);

  const showMessageModal = messages.length > 0;

  if (convertSceneModalVisible && !isViewing) {
    return <ConvertSceneModal />;
  }

  if (showMessageModal) {
    return <MessageModal />;
  }

  return null;
};

export default useSceneModal;
