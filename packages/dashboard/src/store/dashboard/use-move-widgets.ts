import { throttle } from 'lodash';
import { useCallback } from 'react';
import { useStoreDispatch } from '../hooks';
import { moveWidgets } from './reducer';

export function useMoveWidgets() {
  const dispatch = useStoreDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onMoveWidgets = useCallback(
    throttle(
      (payload: Parameters<typeof moveWidgets>[0]) =>
        dispatch(moveWidgets(payload)),
      16.7
    ),
    [dispatch]
  );

  return onMoveWidgets;
}
