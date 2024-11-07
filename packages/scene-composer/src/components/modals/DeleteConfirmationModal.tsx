import { Alert, Box, Button, Header, SpaceBetween } from '@cloudscape-design/components';
import { type ReactNode, useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { accessStore } from '../../store';
import CenteredContainer from '../CenteredContainer';

interface DeleteConfirmationModalProps {
  title: string;
  contentBody: ReactNode;
  warningMessage: string;

  deleteButtonDisabled?: boolean;
  onDelete(): void;
}
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  title,
  contentBody,
  warningMessage,
  deleteButtonDisabled,
  onDelete,
}: DeleteConfirmationModalProps) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { formatMessage } = useIntl();
  const setDeleteConfirmationModalVisible = accessStore(sceneComposerId)(
    (state) => state.setDeleteConfirmationModalVisible,
  );

  const onClose = useCallback(() => {
    setDeleteConfirmationModalVisible(false);
  }, [setDeleteConfirmationModalVisible]);

  return (
    <CenteredContainer
      header={<Header variant='h2'>{title}</Header>}
      footer={
        <Box float='right' padding={{ bottom: 's' }}>
          <SpaceBetween size='s' direction='horizontal'>
            <Button data-testid='cancel-button' onClick={onClose}>
              {formatMessage({ description: 'button label', defaultMessage: 'Cancel' })}
            </Button>

            <Button data-testid='delete-button' disabled={deleteButtonDisabled} variant='primary' onClick={onDelete}>
              {formatMessage({ description: 'button label', defaultMessage: 'Delete' })}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size='s'>
        {contentBody}

        <Alert statusIconAriaLabel='Warning' type='warning'>
          {warningMessage}
        </Alert>
      </SpaceBetween>
    </CenteredContainer>
  );
};

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';

export default DeleteConfirmationModal;
