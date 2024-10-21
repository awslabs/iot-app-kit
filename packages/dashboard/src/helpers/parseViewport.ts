export const parseViewport = (viewport?: string) => {
  return viewport ? JSON.parse(viewport) : undefined;
};
