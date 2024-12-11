import { useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelectedWidgetIds } from '~/features/widgetSelection/useSelectedWidgetIds';
import { copyWidgets, pasteWidgets } from '#dashboard-configuration/store';
import { useStoreDispatch, useStoreSelector } from '#store/hooks';

export type UseCopyPasteResult = ReturnType<typeof useCopyPaste>;

export function useCopyPaste() {
  const dispatch = useStoreDispatch();
  const selectedWidgetIds = useSelectedWidgetIds();
  const copiedWidgetIds = useStoreSelector(
    (state) => state.dashboard.present.copiedWidgetIds,
    shallowEqual
  );

  const canCopy = selectedWidgetIds.length > 0;
  const canPaste = copiedWidgetIds.length > 0;

  const copy = useCallback(() => {
    // wasteful dispatch is avoided
    if (canCopy) {
      dispatch(copyWidgets({ widgetIds: selectedWidgetIds }));
    }
  }, [dispatch, canCopy, selectedWidgetIds]);

  const paste = useCallback(
    ({
      position,
    }: Pick<Parameters<typeof pasteWidgets>[0], 'position'> = {}) => {
      // wasteful dispatch is avoided
      if (canPaste) {
        dispatch(pasteWidgets({ position, widgetIds: copiedWidgetIds }));
      }
    },
    [dispatch, canPaste, copiedWidgetIds]
  );

  return {
    /** Flag indicating if copy action is enabled. */
    canCopy,
    /** Flag indicating if paste action is enabled. */
    canPaste,
    /** Copy the currently selected widgets. */
    copy,
    /** Paste the currently copied widgets. */
    paste,
  };
}
