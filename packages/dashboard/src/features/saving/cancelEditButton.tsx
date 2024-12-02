import { TertiaryButton } from '@iot-app-kit/atoms/button/tertiary';
import { useDialog } from '@iot-app-kit/atoms/dialog/useDialog';
import { memo, useCallback } from 'react';
import { useUndoRedo } from '../configuration/useDashboardConfiguration';
import { useMode } from '../mode/useMode';
import { useSelection } from '../selection/useSelectedWidgets';
import { CancelEditDialog } from './cancelEditDialog';
import { useSaveDashboard } from './useSaveDashboard';

export const CancelEditButton = memo(() => {
  const { status } = useSaveDashboard();
  const clearSelection = useSelection((state) => state.clearSelection);
  const { clear } = useUndoRedo();
  const {
    isVisible: isCancelDialogVisible,
    open: openCancelDialog,
    close: closeCancelDialog,
  } = useDialog();
  const { selectMode } = useMode();

  const handleConfirmCancelEdit = useCallback(() => {
    closeCancelDialog();
    selectMode({ mode: 'view' });
    clearSelection();
    clear();
  }, [closeCancelDialog, selectMode, clearSelection, clear]);

  return (
    <>
      <TertiaryButton disabled={status === 'saving'} onClick={openCancelDialog}>
        Cancel
      </TertiaryButton>

      <CancelEditDialog
        visible={isCancelDialogVisible}
        onConfirm={handleConfirmCancelEdit}
        onCancel={closeCancelDialog}
      />
    </>
  );
});
