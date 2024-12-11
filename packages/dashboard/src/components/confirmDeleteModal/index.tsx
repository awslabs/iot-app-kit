import { memo, type ReactElement } from 'react';
import CloudscapeBox from '@cloudscape-design/components/box';
import CloudscapeButton from '@cloudscape-design/components/button';
import CloudscapeModal from '@cloudscape-design/components/modal';
import CloudscapeSpaceBetween from '@cloudscape-design/components/space-between';
import { Button } from '@iot-app-kit/atoms';

export interface ConfirmDeleteModalProps {
  headerTitle: string;
  cancelTitle?: string;
  submitTitle: string;
  description: ReactElement | string;
  visible: boolean;
  handleDismiss: VoidFunction;
  handleCancel: VoidFunction;
  handleSubmit: VoidFunction;
}

const ConfirmDeleteModal = memo(
  ({
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
      <CloudscapeModal
        visible={visible}
        onDismiss={handleDismiss}
        header={headerTitle}
        data-testid='confirm-modal'
        footer={
          <CloudscapeBox float='right'>
            <CloudscapeSpaceBetween direction='horizontal' size='xs'>
              {cancelTitle && (
                <CloudscapeButton variant='link' onClick={handleCancel}>
                  {cancelTitle}
                </CloudscapeButton>
              )}
              <Button type='primary' onClick={handleSubmit}>
                {submitTitle}
              </Button>
            </CloudscapeSpaceBetween>
          </CloudscapeBox>
        }
      >
        {description}
      </CloudscapeModal>
    );
  }
);

export default ConfirmDeleteModal;
