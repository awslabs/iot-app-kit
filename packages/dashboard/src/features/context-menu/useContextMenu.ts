import { useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import { useStoreDispatch, useStoreSelector } from '#store/hooks';
import { closeContextMenu, openContextMenu } from './store';

export type UseContextMenuResult = ReturnType<typeof useContextMenu>;

export function useContextMenu() {
  const dispatch = useStoreDispatch();
  const position = useStoreSelector(
    (state) => state.contextMenu.position,
    shallowEqual
  );
  const isVisible = !!position;

  const onOpen = useCallback(
    (payload: Parameters<typeof openContextMenu>[0]) => {
      // avoid wasteful dispatch
      if (!isVisible) {
        dispatch(openContextMenu(payload));
      }
    },
    [isVisible, dispatch]
  );

  const onClose = useCallback(() => {
    // avoid wasteful dispatch
    if (isVisible) {
      dispatch(closeContextMenu());
    }
  }, [isVisible, dispatch]);

  return {
    /** Coordinates of the visible context menu. */
    position,
    /** Use to open the context menu. */
    open: onOpen,
    /** Use to close the context menu. */
    close: onClose,
  };
}
