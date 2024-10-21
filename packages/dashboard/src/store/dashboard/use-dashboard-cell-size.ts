import { useCallback } from 'react';
import { useStoreDispatch, useStoreSelector } from '../hooks';
import { updateCellSize } from './reducer';
import { selectDashboardCellSize } from './selectors';

export function useDashboardCellSize() {
  const dispatch = useStoreDispatch();
  const cellSize = useStoreSelector(selectDashboardCellSize);
  const setCellSize = useCallback(
    (payload: typeof cellSize) => {
      dispatch(updateCellSize(payload));
    },
    [dispatch]
  );

  return [cellSize, setCellSize] as const;
}
