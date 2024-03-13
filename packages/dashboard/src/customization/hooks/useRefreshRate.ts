import { useDispatch, useSelector } from 'react-redux';
import { RefreshRate } from '~/components/querySettingsSync/types';
import { onUpdateRefreshRateAction } from '~/store/actions';
import { DashboardState } from '~/store/state';

export const useRefreshRate = () => {
  const dispatch = useDispatch();

  const updateRefreshRate = (refreshRate: RefreshRate) => {
    dispatch(
      onUpdateRefreshRateAction({
        refreshRate,
      })
    );
  };

  const refreshRate = useSelector(
    (state: DashboardState) =>
      state.dashboardConfiguration.querySettings?.refreshRate
  );

  return [refreshRate, updateRefreshRate] as const;
};
