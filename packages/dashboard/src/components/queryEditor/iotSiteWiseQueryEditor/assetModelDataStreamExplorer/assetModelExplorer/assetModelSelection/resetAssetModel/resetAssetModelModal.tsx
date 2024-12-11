import CloudscapeAlert from '@cloudscape-design/components/alert';
import CloudscapeBox from '@cloudscape-design/components/box';
import CloudscapeButton from '@cloudscape-design/components/button';
import CloudscapeModal from '@cloudscape-design/components/modal';
import CloudscapeSpaceBetween from '@cloudscape-design/components/space-between';
import { Button } from '@iot-app-kit/atoms';
import { memo } from 'react';

export interface ResetAssetModelModalProps {
  visible: boolean;
  onHide: VoidFunction;
  onReset: VoidFunction;
}

export const ResetAssetModelModal = memo(
  ({ visible, onHide, onReset }: ResetAssetModelModalProps) => {
    return (
      <CloudscapeModal
        onDismiss={onHide}
        visible={visible}
        footer={
          <CloudscapeBox float='right'>
            <CloudscapeSpaceBetween direction='horizontal' size='xs'>
              <CloudscapeButton onClick={onHide} variant='link'>
                Cancel
              </CloudscapeButton>
              <Button type='primary' onClick={onReset}>
                Reset
              </Button>
            </CloudscapeSpaceBetween>
          </CloudscapeBox>
        }
        header='Reset asset model'
      >
        <CloudscapeAlert
          statusIconAriaLabel='Warning'
          type='warning'
          header='Removing this asset model will remove associated parameters from widgets on this dashboard.'
        >
          This action cannot be undone. Once reset, you may associate this
          dashboard with a different asset model.
        </CloudscapeAlert>
      </CloudscapeModal>
    );
  }
);
