import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

let iotSitewiseClient: IoTSiteWiseClient;

export const Client = Object.freeze({
  getInstance: () => iotSitewiseClient,
  setInstance: (client: IoTSiteWiseClient) => {
    iotSitewiseClient = client;
  },
});
