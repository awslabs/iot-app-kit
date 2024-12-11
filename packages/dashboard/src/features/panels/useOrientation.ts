import { useCallback } from 'react';
import { useMode } from '#features/mode/useMode';
import { useStoreDispatch, useStoreSelector } from '#store/hooks';
import { changeOrientation, type PanelOrientation } from './store';

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
