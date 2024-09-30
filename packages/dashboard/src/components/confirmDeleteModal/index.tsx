import React, { ReactElement } from 'react';

import {
  Box,
  Button,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';

interface ConfirmDeleteModalProps {
  headerTitle: string;
  cancelTitle?: string;
  submitTitle: string;
  description: ReactElement | string;
  visible: boolean;
  handleDismiss: () => void;
  handleCancel: () => void;
  handleSubmit: () => void;
}

const ConfirmDeleteModal = ({
  headerTitle,
  cancelTitle = 'Cancel',
  submitTitle,
  description,
  visible,
  handleDismiss,
  handleCancel,
  handleSubmit,
}: ConfirmDeleteModalProps) => {
  return (
    <Modal
      visible={visible}
      onDismiss={handleDismiss}
      header={headerTitle}
      data-testid='confirm-modal'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            {cancelTitle && (
              <Button variant='link' onClick={handleCancel}>
                {cancelTitle}
              </Button>
            )}

            <Button variant='primary' onClick={handleSubmit}>
              {submitTitle}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      {description}
    </Modal>
  );
};

export default ConfirmDeleteModal;
