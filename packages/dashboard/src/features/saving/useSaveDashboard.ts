import { useCallback } from 'react';
import {
  useDashboardConfiguration,
  useUndoRedo,
} from '../configuration/useDashboardConfiguration';
import { useMode } from '../mode/useMode';
import { useSelection } from '../selection/useSelectedWidgets';
import { useSaving } from './useSaving';

export function useSaveDashboard() {
  const onSave: () => Promise<void> = () => new Promise(() => {});
  const { status, save } = useSaving();
  const { dashboardConfiguration } = useDashboardConfiguration();
  const { selectMode } = useMode();
  const { clearSelection } = useSelection();
  const { clear } = useUndoRedo();

  const handleSave = useCallback(async () => {
    if (status === 'saving') return;

    await save({ dashboardConfiguration, onSave });
    selectMode({ mode: 'view' });
    clearSelection();
    clear();
  }, [
    status,
    save,
    dashboardConfiguration,
    onSave,
    selectMode,
    clearSelection,
    clear,
  ]);

  return { status, handleSave };
}
