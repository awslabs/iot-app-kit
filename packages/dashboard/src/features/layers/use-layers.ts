import { max, min } from 'lodash';
import {
  createShallowStoreSelector,
  createStoreSelector,
  useStoreSelector,
} from '~/store';

const selectWidgetZPositions = createShallowStoreSelector(
  [(state) => state.dashboard.present.dashboardConfiguration.widgets],
  (widgets) => widgets.map(({ z }) => z)
);

const selectHighestWidgetZPosition = createStoreSelector(
  [selectWidgetZPositions],
  (zs) => max(zs) ?? 0
);

const selectLowestWidgetZPosition = createStoreSelector(
  [selectWidgetZPositions],
  (zs) => min(zs) ?? 0
);

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
  const maxZ = useStoreSelector(selectHighestWidgetZPosition);
  const minZ = useStoreSelector(selectLowestWidgetZPosition);

  return {
    userSelectionLayer: maxZ + layers.userSelectionLayer,
    selectionBoxLayer: maxZ + layers.selectionBoxLayer,
    contextMenuLayer: maxZ + layers.contextMenuLayer,
    selectionGestureLayer: minZ - layers.selectionGestureLayer,
  };
};
