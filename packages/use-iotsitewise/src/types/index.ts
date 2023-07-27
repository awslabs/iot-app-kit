import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryKey } from '@tanstack/react-query';

export interface WithClient {
  client: IoTSiteWiseClient;
}

export type CacheKey = QueryKey;
