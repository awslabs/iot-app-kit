import { useMemo } from 'react';

import { v4 as uuid } from 'uuid';

const generateId = (id?: string) =>
  id && id.length > 0 ? id : `widget-${uuid()}`;

/**
 * Hook that provides a memoized id for the chart.
 * Will use the given id if defined or generate a unique one
 */
export const useComponentId = (id?: string) => {
  return useMemo(() => generateId(id), [id]);
};
