import { MinimalViewPortConfig } from '@synchro-charts/core';
import { isMinimalStaticViewport } from './predicates';
import { parseDuration } from './time';

export const viewportStartDate = (viewportConfig: MinimalViewPortConfig, currentDate?: Date): Date =>
  isMinimalStaticViewport(viewportConfig)
    ? new Date(viewportConfig.start)
    : new Date((currentDate?.getTime() || Date.now()) - parseDuration(viewportConfig.duration));

export const viewportEndDate = (viewportConfig: MinimalViewPortConfig, currentDate?: Date): Date => {
  return isMinimalStaticViewport(viewportConfig) ? new Date(viewportConfig.end) : currentDate || new Date(Date.now());
};
