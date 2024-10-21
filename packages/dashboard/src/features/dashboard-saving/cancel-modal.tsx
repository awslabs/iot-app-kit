import CloudscapeAlert from '@cloudscape-design/components/alert';
import CloudscapeButton from '@cloudscape-design/components/button';
import React, { memo } from 'react';
import { Modal, ModalFooter, type ModalProps } from '~/atoms/modal';

export interface CancelModalProps {
  visible: ModalProps['visible'];
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
}

export const CancelModal = memo(function ({
  visible,
  onConfirm,
  onCancel,
}: CancelModalProps) {
  return (
    <Modal
      visible={visible}
      onDismiss={onCancel}
      header='Exit edit mode?'
      footer={
        <ModalFooter>
          <CloudscapeButton variant='link' onClick={onCancel}>
            No
          </CloudscapeButton>
          <CloudscapeButton variant='primary' onClick={onConfirm}>
            Yes
          </CloudscapeButton>
        </ModalFooter>
      }
    >
      <CloudscapeAlert type='warning'>
        Are you sure you want to exit edit mode? The changes that you made won't
        be saved.
      </CloudscapeAlert>
    </Modal>
  );
});
