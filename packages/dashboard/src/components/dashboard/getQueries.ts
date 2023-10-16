import { DashboardClientConfiguration, DashboardIotSiteWiseQueries } from '~/types';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { getClients } from './getClients';

export const getQueries = (dashboardClientConfiguration: DashboardClientConfiguration): DashboardIotSiteWiseQueries => {
  const { iotEventsClient, iotSiteWiseClient } = getClients(dashboardClientConfiguration);

  if (!iotEventsClient || !iotSiteWiseClient) {
    throw new Error('Could not initialize iot sitewise query.');
  }

  const iotSiteWiseQuery = initialize({
    // @ts-expect-error TODO: Fix this
    iotSiteWiseClient: iotSiteWiseClient,
    iotEventsClient: iotEventsClient,
    // Collect requests over 1 second before sending
    settings: {
      batchDuration: 1000,
    },
  }).query;

  return {
    iotSiteWiseQuery,
  };
};
