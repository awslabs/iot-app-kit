import { useCallback } from 'react';
import { useStoreDispatch, useStoreSelector } from '~/store/hooks';
import { enterEditMode, exitEditMode } from './mode-store';

export type UseModeResult = ReturnType<typeof useMode>;

export function useMode() {
  const dispatch = useStoreDispatch();
  const mode = useStoreSelector((state) => state.mode);

  const onEnterEditMode = useCallback(() => {
    dispatch(enterEditMode());
  }, [dispatch]);

  const onExitEditMode = useCallback(() => {
    dispatch(exitEditMode());
  }, [dispatch]);

  return { mode, enterEditMode: onEnterEditMode, exitEditMode: onExitEditMode };
}
