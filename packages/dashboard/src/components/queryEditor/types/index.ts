import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

/** Utility type for IoT SiteWise Client. */
export interface WithIoTSiteWiseClient {
  /** AWS SDK v3 IoT SiteWise client. */
  client: IoTSiteWiseClient;
}

/** Utility type for AbortSignal. */
export interface WithAbortSignal {
  /** Optional AbortSignal instance to enable query cancellation. */
  signal?: AbortSignal;
}
