import CloudscapeButton from '@cloudscape-design/components/button';
import React, { memo, useCallback } from 'react';
import { useDashboardHistory } from '~/features/dashboard-history';
import { useMode } from '~/features/dashboard-mode';
import { useDashboardContext } from '~/services/use-dashboard';
import { useStoreDispatch, useStoreSelector } from '~/store';
import { clearSelection } from '../widget-selection/selection-store';
import { save } from './saving-store';

const noopOnSave = async () => {};

export const SaveButton = memo(() => {
  const dispatch = useStoreDispatch();
  const { onSave: userDefinedOnSave } = useDashboardContext();
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
    <CloudscapeButton
      variant='primary'
      onClick={onSave}
      disabled={status === 'saving'}
      loading={status === 'saving'}
      loadingText='Saving dashboard'
    >
      Save
    </CloudscapeButton>
  );
});
