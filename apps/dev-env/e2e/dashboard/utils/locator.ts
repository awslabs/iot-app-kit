import { type Locator } from '@playwright/test';

export const getBoundingBox = async (locator: Locator) => {
  const bounds = await locator.boundingBox();
  if (!bounds) throw new Error('could not get bounding box for locator');
  return bounds;
};

export type BoundingBox = Awaited<ReturnType<typeof getBoundingBox>>;
