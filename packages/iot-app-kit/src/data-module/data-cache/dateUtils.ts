import { MinimalViewPortConfig } from '@synchro-charts/core';
import { DateInterval } from './requestTypes';
import { isMinimalStaticViewport } from '../../utils/predicates';

/**
 * Collect the errors across the relevant data stream infos
 */

export const getDateInterval = (viewport: MinimalViewPortConfig): DateInterval => {
  const start = isMinimalStaticViewport(viewport)
    ? new Date(viewport.start)
    : new Date(Date.now() - (viewport.duration as number));
  const end = isMinimalStaticViewport(viewport) ? new Date(viewport.end) : new Date();
  return {
    start,
    end,
  };
};
