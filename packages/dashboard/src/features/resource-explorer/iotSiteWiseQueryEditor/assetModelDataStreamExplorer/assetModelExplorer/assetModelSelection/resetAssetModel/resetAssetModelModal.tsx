import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';

export const ResetAssetModelModal = ({
  visible,
  onHide,
  onReset,
}: {
  visible: boolean;
  onHide: () => void;
  onReset?: () => void;
}) => {
  return (
    <Modal
      onDismiss={onHide}
      visible={visible}
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={onHide} variant='link'>
              Cancel
            </Button>
            <Button variant='primary' onClick={onReset}>
              Reset
            </Button>
          </SpaceBetween>
        </Box>
      }
      header='Reset asset model'
    >
      <Alert
        statusIconAriaLabel='Warning'
        type='warning'
        header='Removing this asset model will remove associated parameters from widgets on this dashboard.'
      >
        This action cannot be undone. Once reset, you may associate this
        dashboard with a different asset model.
      </Alert>
    </Modal>
  );
};
