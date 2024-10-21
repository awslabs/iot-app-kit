import { useCallback } from 'react';
import { useMode } from '~/features/dashboard-mode';
import { useStoreDispatch, useStoreSelector } from '~/store';
import { changeOrientation, type PanelOrientation } from './panel-store';

export function useOrientation() {
  const { mode } = useMode();
  const orientation = useStoreSelector(
    (state) => state.panels[mode].orientation
  );
  const dispatch = useStoreDispatch();

  const setOrientation = useCallback(
    (orientation: PanelOrientation) => {
      dispatch(changeOrientation({ mode, orientation }));
    },
    [mode, dispatch]
  );

  return [orientation, setOrientation] as const;
}
