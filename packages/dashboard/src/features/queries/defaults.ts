import { type SiteWiseQueryConfig } from '~/features/queries/queries';

export const DEFAULT_QUERY_CONFIG = {
  source: 'iotsitewise',
  query: undefined,
} as const satisfies SiteWiseQueryConfig;
