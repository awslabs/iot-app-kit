import { useCallback } from 'react';
import { useStoreDispatch } from '../hooks';
import { disableCanvas, enableCanvas } from './reducer';

export function useCanvasControl() {
  const dispatch = useStoreDispatch();

  const onDisableCanvas = useCallback(() => {
    dispatch(disableCanvas);
  }, [dispatch]);

  const onEnableCanvas = useCallback(() => {
    dispatch(enableCanvas);
  }, [dispatch]);

  return { disableCanvas: onDisableCanvas, enableCanvas: onEnableCanvas };
}
