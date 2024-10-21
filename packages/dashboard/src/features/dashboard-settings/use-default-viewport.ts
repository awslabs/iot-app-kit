import { useCallback } from 'react';
import {
  createStoreSelector,
  useStoreDispatch,
  useStoreSelector,
} from '~/store';
import { updateDefaultViewport } from '~/store/dashboard/reducer';

export const selectDefaultViewport = createStoreSelector(
  [(state) => state.dashboard.present.dashboardConfiguration.defaultViewport],
  (defaultViewport) => defaultViewport
);

export function useDefaultViewport() {
  const dispatch = useStoreDispatch();
  const defaultViewport = useStoreSelector(selectDefaultViewport);
  const setDefaultViewport = useCallback(
    (payload: typeof defaultViewport) => {
      dispatch(updateDefaultViewport(payload));
    },
    [dispatch]
  );

  return [defaultViewport, setDefaultViewport] as const;
}
