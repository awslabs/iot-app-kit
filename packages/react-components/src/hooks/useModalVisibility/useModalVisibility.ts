import { useState } from 'react';

export const useModalVisibility = (initialVisibility = false) => {
  const [modalVisible, setModalVisible] = useState(initialVisibility);
  const onHideModal = () => setModalVisible(false);
  const onShowModal = () => setModalVisible(true);

  return {
    visible: modalVisible,
    onHide: onHideModal,
    onShow: onShowModal,
  };
};
