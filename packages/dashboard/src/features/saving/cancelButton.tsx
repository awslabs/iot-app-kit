import { memo, useCallback, useState } from 'react';
import { useDashboardHistory } from '#features/history/useHistory';
import { useMode } from '#features/mode/useMode';
import { clearSelection } from '~/features/widgetSelection/selectionStore';
import { useStoreDispatch, useStoreSelector } from '#store/hooks';
import { CancelModal } from './cancelModal';
import { SecondaryButton } from '@iot-app-kit/atoms';

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
      <SecondaryButton
        onClick={handleInitiateCancel}
        disabled={status === 'saving'}
      >
        Cancel
      </SecondaryButton>

      <CancelModal
        visible={isModalVisible}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
      />
    </>
  );
});
