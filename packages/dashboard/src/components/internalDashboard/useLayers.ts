import { useSelector } from 'react-redux';
import max from 'lodash/max';

import { DashboardState } from '~/store/state';

type Layers = {
  userSelectionLayer: number;
  selectionBoxLayer: number;
  contextMenuLayer: number;
};
const layers: Layers = {
  userSelectionLayer: 2,
  selectionBoxLayer: 1,
  contextMenuLayer: 3,
};

export const useLayers = (): Layers => {
  const widgets = useSelector((state: DashboardState) => state.dashboardConfiguration.widgets);

  const z = max(widgets.map(({ z }) => z)) ?? 0;

  return {
    userSelectionLayer: z + layers.userSelectionLayer,
    selectionBoxLayer: z + layers.selectionBoxLayer,
    contextMenuLayer: z + layers.contextMenuLayer,
  };
};
