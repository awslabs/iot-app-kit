import { WarningAlert } from '@iot-app-kit/atoms/alert/warning';
import { PrimaryButton } from '@iot-app-kit/atoms/button/primary';
import { TertiaryButton } from '@iot-app-kit/atoms/button/tertiary';
import { Dialog, type DialogProps } from '@iot-app-kit/atoms/dialog';
import { DialogFooter } from '@iot-app-kit/atoms/dialog/footer';
import { memo } from 'react';

export interface CancelEditDialogProps {
  visible: DialogProps['visible'];
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
}

export const CancelEditDialog = memo(
  ({ visible, onConfirm, onCancel }: CancelEditDialogProps) => {
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
        <WarningAlert>
          Are you sure you want to exit edit mode? The changes that you made
          won't be saved.
        </WarningAlert>
      </Dialog>
    );
  }
);
