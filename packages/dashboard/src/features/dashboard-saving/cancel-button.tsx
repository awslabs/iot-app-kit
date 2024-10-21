import CloudscapeButton from '@cloudscape-design/components/button';
import React, { memo, useCallback, useState } from 'react';
import { useDashboardHistory } from '~/features/dashboard-history';
import { useMode } from '~/features/dashboard-mode';
import { useStoreDispatch, useStoreSelector } from '~/store';
import { clearSelection } from '../widget-selection/selection-store';
import { CancelModal } from './cancel-modal';

export const CancelButton = memo(() => {
  const dispatch = useStoreDispatch();
  const { reset } = useDashboardHistory();
  const status = useStoreSelector((state) => state.saving.status);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { exitEditMode } = useMode();

  const handleInitiateCancel = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    setIsModalVisible(false);
    exitEditMode();
    dispatch(clearSelection());
    reset();
  }, [exitEditMode, reset, dispatch]);

  const handleCancelCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  return (
    <>
      <CloudscapeButton
        onClick={handleInitiateCancel}
        disabled={status === 'saving'}
      >
        Cancel
      </CloudscapeButton>

      <CancelModal
        visible={isModalVisible}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
      />
    </>
  );
});
