import {
  DashboardClientConfiguration,
  DashboardIotSiteWiseQueries,
} from '~/types';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { getClients } from './getClients';
import { type EdgeMode } from '@iot-app-kit/core';

export const getQueries = (
  dashboardClientConfiguration: DashboardClientConfiguration,
  edgeMode?: EdgeMode
): DashboardIotSiteWiseQueries => {
  const { iotEventsClient, iotSiteWiseClient } = getClients(
    dashboardClientConfiguration
  );

  if (!iotEventsClient || !iotSiteWiseClient) {
    throw new Error('Could not initialize iot sitewise query.');
  }

  const iotSiteWiseQuery = initialize({
    iotSiteWiseClient: iotSiteWiseClient,
    iotEventsClient: iotEventsClient,
    // Collect batch requests before sending
    settings: {
      batchDuration: 100,
      edgeMode,
    },
  }).query;

  return {
    iotSiteWiseQuery,
  };
};
