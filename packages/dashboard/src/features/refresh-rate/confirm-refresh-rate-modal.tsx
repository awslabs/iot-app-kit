import CloudscapeAlert from '@cloudscape-design/components/alert';
import CloudscapeButton from '@cloudscape-design/components/button';
import React, { memo } from 'react';
import { Modal, ModalFooter, type ModalProps } from '~/atoms/modal';

export interface ConfirmRefreshRateModal {
  visible: ModalProps['visible'];
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
}

export const ConfirmRefreshRateModal = memo(function ({
  visible,
  onConfirm,
  onCancel,
}: ConfirmRefreshRateModal) {
  return (
    <Modal
      visible={visible}
      onDismiss={onCancel}
      header='Potential performance impact'
      data-testid='confirm-modal'
      footer={
        <ModalFooter>
          <CloudscapeButton variant='link' onClick={onCancel}>
            Cancel
          </CloudscapeButton>

          <CloudscapeButton variant='primary' onClick={onConfirm}>
            Ok
          </CloudscapeButton>
        </ModalFooter>
      }
    >
      <CloudscapeAlert statusIconAriaLabel='Warning' type='warning'>
        You may experience some lag by selecting the 1 second refresh rate.
      </CloudscapeAlert>
    </Modal>
  );
});
