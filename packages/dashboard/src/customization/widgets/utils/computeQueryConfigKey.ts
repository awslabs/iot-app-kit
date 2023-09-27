import type { Viewport } from '@iot-app-kit/core';
import type { QueryProperties } from '../types';

export const computeQueryConfigKey = (
  viewport: Viewport | undefined,
  { query, source }: QueryProperties['queryConfig']
) => {
  return `${JSON.stringify(viewport)}_${source}__${JSON.stringify(query?.assets)}`;
};
