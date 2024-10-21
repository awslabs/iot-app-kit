import { throttle } from 'lodash';
import { useCallback } from 'react';
import { useStoreDispatch } from '../hooks';
import { resizeWidgets } from './reducer';

export function useResizeWidgets() {
  const dispatch = useStoreDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResizeWidgets = useCallback(
    throttle(
      (payload: Parameters<typeof resizeWidgets>[0]) =>
        dispatch(resizeWidgets(payload)),
      16.7
    ),
    [dispatch]
  );

  return onResizeWidgets;
}
