import CloudscapeAlert from '@cloudscape-design/components/alert';
import { memo } from 'react';
import {
  Dialog,
  DialogFooter,
  PrimaryButton,
  TertiaryButton,
  type DialogProps,
} from '@iot-app-kit/atoms';

export interface CancelModalProps {
  visible: DialogProps['visible'];
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
}

export const CancelModal = memo(
  ({ visible, onConfirm, onCancel }: CancelModalProps) => {
    return (
      <Dialog
        visible={visible}
        onDismiss={onCancel}
        header='Exit edit mode?'
        footer={
          <DialogFooter>
            <TertiaryButton onClick={onCancel}>No</TertiaryButton>
            <PrimaryButton onClick={onConfirm}>Yes</PrimaryButton>
          </DialogFooter>
        }
      >
        <CloudscapeAlert type='warning'>
          Are you sure you want to exit edit mode? The changes that you made
          won't be saved.
        </CloudscapeAlert>
      </Dialog>
    );
  }
);
