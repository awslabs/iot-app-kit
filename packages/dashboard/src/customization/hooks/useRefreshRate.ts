import { useDispatch, useSelector } from 'react-redux';
import { onUpdateRefreshRateAction } from '~/store/actions';
import { DashboardState } from '~/store/state';
import { RefreshRate } from '~/components/querySettingsSync/types';

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
