import { isHistoricalViewport } from '../../common/predicates';
import { parseDuration } from '../../common/time';
import type { DateInterval, Viewport } from './requestTypes';

/**
 * Collect the errors across the relevant data stream infos
 */

export const getDateInterval = (viewport: Viewport): DateInterval => {
  const start = isHistoricalViewport(viewport)
    ? new Date(viewport.start)
    : new Date(Date.now() - parseDuration(viewport.duration));
  const end = isHistoricalViewport(viewport)
    ? new Date(viewport.end)
    : new Date();
  return {
    start,
    end,
  };
};
