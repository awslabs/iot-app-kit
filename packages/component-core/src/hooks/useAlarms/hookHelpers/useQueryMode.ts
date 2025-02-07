import { useMemo } from 'react';
import { isDurationViewport, type Viewport } from '@iot-app-kit/core';

export type QueryMode = 'LATEST' | 'LATEST_IN_VIEWPORT' | 'HISTORICAL' | 'LIVE';

export const useQueryMode = ({
  fetchOnlyLatest,
  viewport,
}: {
  fetchOnlyLatest?: boolean;
  viewport?: Viewport;
}): QueryMode => {
  return useMemo(() => {
    // No viewport present, only fetch the latest value using the
    // get latest asset property value api
    if (viewport == null) return 'LATEST';

    // Only fetch the latest asset property value
    // but for a given viewport. This means
    // we will fetch the most recent asset property
    // value before the end of the viewport
    if (fetchOnlyLatest) return 'LATEST_IN_VIEWPORT';

    if (isDurationViewport(viewport)) return 'LIVE';

    return 'HISTORICAL';
  }, [fetchOnlyLatest, viewport]);
};
