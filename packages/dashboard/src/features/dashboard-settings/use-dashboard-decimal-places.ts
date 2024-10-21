import { useCallback } from 'react';
import {
  createStoreSelector,
  useStoreDispatch,
  useStoreSelector,
} from '~/store';
import { updateDecimalPlaces } from '~/store/dashboard/reducer';

const selectDashboardDecimalPlaces = createStoreSelector(
  [
    (state) =>
      state.dashboard.present.dashboardConfiguration.displaySettings
        .significantDigits,
  ],
  (significantDigits) => significantDigits
);

export function useDashboardDecimalPlaces() {
  const dispatch = useStoreDispatch();
  const decimalPlaces = useStoreSelector(selectDashboardDecimalPlaces);
  const setDecimalPlaces = useCallback(
    (payload: number) => {
      dispatch(updateDecimalPlaces(payload));
    },
    [dispatch]
  );

  return [decimalPlaces, setDecimalPlaces] as const;
}
