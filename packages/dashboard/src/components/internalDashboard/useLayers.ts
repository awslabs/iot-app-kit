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
  const top = 3;
  const bottom = 3;

  return {
    userSelectionLayer: top + layers.userSelectionLayer,
    selectionBoxLayer: top + layers.selectionBoxLayer,
    contextMenuLayer: top + layers.contextMenuLayer,
    selectionGestureLayer: bottom - layers.selectionGestureLayer,
  };
};
