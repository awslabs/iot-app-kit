import { useCallback } from 'react';
import { ActionCreators } from 'redux-undo';
import { useStoreDispatch, useStoreSelector } from '#store/hooks';
import { createStoreSelector } from '#store/selectors';

const selectCanUndo = createStoreSelector(
  [(state) => state.dashboard.past.length],
  (numOfPastChanges) => numOfPastChanges > 0
);

const selectCanRedo = createStoreSelector(
  [(state) => state.dashboard.future.length],
  (numOfFutureChanges) => numOfFutureChanges > 0
);

export type UseDashboardHistoryResult = ReturnType<typeof useDashboardHistory>;

export function useDashboardHistory() {
  const canUndo = useStoreSelector(selectCanUndo);
  const canRedo = useStoreSelector(selectCanRedo);
  const dispatch = useStoreDispatch();

  const undo = useCallback(() => {
    // avoid wasteful dispatch
    if (canUndo) {
      dispatch(ActionCreators.undo());
    }
  }, [canUndo, dispatch]);

  const redo = useCallback(() => {
    // avoid wasteful dispatch
    if (canRedo) {
      dispatch(ActionCreators.redo());
    }
  }, [canRedo, dispatch]);

  const clear = useCallback(() => {
    // avoid wasteful dispatch
    if (canUndo || canRedo) {
      // remove changes from past and future stacks
      dispatch(ActionCreators.clearHistory());
    }
  }, [canUndo, canRedo, dispatch]);

  const reset = useCallback(() => {
    // avoid wasteful dispatch
    if (canUndo) {
      // move present pointer to first state in past stack
      dispatch(ActionCreators.jumpToPast(0));
    }

    clear();
  }, [canUndo, clear, dispatch]);

  return {
    canUndo,
    canRedo,
    /** Undo the last dashboard change. */
    undo,
    /** Redo the last undone dashboard change. */
    redo,
    /** Clear the dashboard history. */
    clear,
    /** Reset dashboard and clear its history. */
    reset,
  };
}
