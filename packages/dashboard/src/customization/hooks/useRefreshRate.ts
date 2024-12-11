import { type RefreshRate } from '../../components/refreshRate/types';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateRefreshRateAction } from '../../store/actions';
import { type DashboardState } from '../../store/state-old';

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
