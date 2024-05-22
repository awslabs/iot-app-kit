import { useDispatch, useSelector } from 'react-redux';
import { onUpdateDefaultViewportAction } from '~/store/actions/updateDefaultViewport';
import { DashboardState } from '~/store/state';
import { parseViewport } from '~/util/parseViewport';

export const useDefaultViewport = () => {
  const dispatch = useDispatch();

  const { defaultViewport } = useSelector(
    (state: DashboardState) => state.dashboardConfiguration
  );

  const onUpdateDefaultViewport = (updatedDefaultViewport?: string) => {
    dispatch(
      onUpdateDefaultViewportAction({
        defaultViewport: updatedDefaultViewport,
      })
    );
  };

  return {
    defaultViewport: parseViewport(defaultViewport),
    onUpdateDefaultViewport,
  };
};
