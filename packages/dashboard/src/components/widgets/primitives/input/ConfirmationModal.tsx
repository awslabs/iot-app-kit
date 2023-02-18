import React, { Dispatch, useEffect, useState } from 'react';
import useUpdateAssetPropertyValue from '~/components/widgets/primitives/input/hooks/useUpdateAssetPropertyValue';
import useDescribeAssetProperty from '~/components/widgets/primitives/input/hooks/useDescribeAssetProperty';
import { ErrorDetails } from '@aws-sdk/client-iotsitewise';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { Box, Button, ButtonProps, Modal } from '@cloudscape-design/components';

const ConfirmationModal = ({
  showConfirmationModal,
  setShowConfirmationModal,
  submitLabel,
  input,
  setErrorMessage,
  assetId,
  propertyId,
  setSuccessMessage,
  successMessage,
  setIsSending,
}: {
  showConfirmationModal: boolean;
  setShowConfirmationModal: Dispatch<boolean>;
  submitLabel: string;
  input: string;
  setErrorMessage: Dispatch<string | null>;
  assetId: string;
  propertyId: string;
  setSuccessMessage: Dispatch<string | null>;
  successMessage: string | null;
  setIsSending: Dispatch<boolean>;
}) => {
  const [propertyName, setPropertyName] = useState<string>();
  const updateAssetPropertyValue = useUpdateAssetPropertyValue();
  const describeAssetProperty = useDescribeAssetProperty();

  useEffect(() => {
    (async () => {
      if (assetId && propertyId) {
        try {
          const property = await describeAssetProperty({ assetId, propertyId });
          const name = property?.assetProperty?.name;
          if (name) {
            setPropertyName(name);
          }
        } catch (e) {
          setErrorMessage((e as ErrorDetails).message ?? null);
        }
      }
    })();
  }, [showConfirmationModal]);

  const onSubmitInput: NonCancelableEventHandler<ButtonProps.ClickDetail> = async () => {
    setErrorMessage(null);
    if (input) {
      setIsSending(true);

      if (assetId && propertyId) {
        try {
          const response = await updateAssetPropertyValue({ assetId, propertyId, value: input });

          const errorMessage = response?.errorEntries?.[0]?.errors?.[0]?.errorMessage;

          if (errorMessage) {
            setErrorMessage(errorMessage);
          } else {
            setSuccessMessage('Sent successfully!');
          }
        } catch (e) {
          setErrorMessage((e as ErrorDetails).message ?? null);
        }
      }
      setIsSending(false);
    }
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  }, [successMessage]);

  return (
    <>
      {showConfirmationModal && (
        <Modal
          data-testid='input-widget-confirmation-modal'
          onDismiss={() => setShowConfirmationModal(false)}
          visible={showConfirmationModal}
          header='Send input'
          footer={
            <Box float='right'>
              <Button variant='link' onClick={() => setShowConfirmationModal(false)}>
                Cancel
              </Button>
              <Button variant='primary' data-testid='input-widget-confirmation-btn' onClick={onSubmitInput}>
                {submitLabel}
              </Button>
            </Box>
          }
        >
          {`Send "${input}" to `}
          <b>{propertyName}</b>?
        </Modal>
      )}
    </>
  );
};

export default ConfirmationModal;
