export type EdgeMode = 'enabled' | 'disabled';

export const isEdgeModeEnabled = (edgeMode?: EdgeMode) =>
  edgeMode === 'enabled';
