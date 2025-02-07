import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { type ReactElement } from 'react';
import { CustomOrangeButton } from '../customOrangeButton';

export interface ConfirmDeleteModalProps {
  headerTitle: string;
  cancelTitle?: string;
  submitTitle: string;
  description: ReactElement | string;
  visible: boolean;
  handleDismiss: () => void;
  handleCancel: () => void;
  handleSubmit: () => void;
}

export const ConfirmDeleteModal = ({
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
            <CustomOrangeButton
              title={submitTitle}
              handleClick={handleSubmit}
            />
          </SpaceBetween>
        </Box>
      }
    >
      {description}
    </Modal>
  );
};
