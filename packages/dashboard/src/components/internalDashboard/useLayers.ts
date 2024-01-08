import { useSelector } from 'react-redux';
import max from 'lodash/max';
import min from 'lodash/min';
import type { DashboardState } from '~/store/state';

type Layers = {
  userSelectionLayer: number;
  selectionBoxLayer: number;
  contextMenuLayer: number;
  selectionGestureLayer: number;
};
const layers: Layers = {
  userSelectionLayer: 2,
  selectionBoxLayer: 1,
  contextMenuLayer: 3,
  selectionGestureLayer: 1,
};

export const useLayers = (): Layers => {
  const widgets = useSelector(
    (state: DashboardState) => state.dashboardConfiguration.widgets
  );

  const top = max(widgets.map(({ z }) => z)) ?? 0;
  const bottom = min(widgets.map(({ z }) => z)) ?? 0;

  return {
    userSelectionLayer: top + layers.userSelectionLayer,
    selectionBoxLayer: top + layers.selectionBoxLayer,
    contextMenuLayer: top + layers.contextMenuLayer,
    selectionGestureLayer: bottom - layers.selectionGestureLayer,
  };
};
