import { memo, useCallback } from 'react';
import { useDashboardHistory } from '#features/history/useHistory';
import { useMode } from '#features/mode/useMode';
import { useStoreDispatch, useStoreSelector } from '#store/hooks';
import { clearSelection } from '../widgetSelection/selectionStore';
import { save } from './store';
import { useMeta } from '#meta/useMeta';
import { PrimaryButton } from '@iot-app-kit/atoms';

const noopOnSave = async () => {};

export const SaveButton = memo(() => {
  const dispatch = useStoreDispatch();
  const { onSave: userDefinedOnSave } = useMeta();
  const { clear: clearHistory } = useDashboardHistory();
  const dashboardConfiguration = useStoreSelector(
    (state) => state.dashboard.present.dashboardConfiguration
  );
  const { exitEditMode } = useMode();
  const status = useStoreSelector((state) => state.saving.status);
  const onSave = useCallback(async () => {
    await dispatch(
      save({
        dashboardConfiguration,
        onSave: userDefinedOnSave ?? noopOnSave,
      })
    );

    exitEditMode();
    dispatch(clearSelection());
    clearHistory();
  }, [
    clearHistory,
    exitEditMode,
    dispatch,
    userDefinedOnSave,
    dashboardConfiguration,
  ]);

  return (
    <PrimaryButton
      onClick={onSave}
      disabled={status === 'saving'}
      loading={status === 'saving'}
      loadingText='Saving dashboard'
    >
      Save
    </PrimaryButton>
  );
});
