import { Modal } from '@cloudscape-design/components';
import React, { ReactNode } from 'react';
import './resourceExplorerModal.css';
export const ResourceExplorerModal = ({
  visible,
  onDismiss,
  resourceExplorer,
}: {
  resourceExplorer: ReactNode;
  visible: boolean;
  onDismiss: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      size='large'
      header='Resource explorer'
    >
      <div className='property-panel-re-container'>{resourceExplorer}</div>
    </Modal>
  );
};
