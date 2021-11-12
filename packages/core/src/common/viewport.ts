import { MinimalViewPortConfig } from '@synchro-charts/core';
import { isMinimalStaticViewport } from './predicates';
import { parseDuration } from './time';

export const viewportStartDate = (viewportConfig: MinimalViewPortConfig): Date =>
  isMinimalStaticViewport(viewportConfig)
    ? new Date(viewportConfig.start)
    : new Date(Date.now() - parseDuration(viewportConfig.duration));

export const viewportEndDate = (viewportConfig: MinimalViewPortConfig): Date => {
  return isMinimalStaticViewport(viewportConfig) ? new Date(viewportConfig.end) : new Date(Date.now());
};
