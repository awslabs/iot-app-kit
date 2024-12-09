import { type EdgeMode } from '@iot-app-kit/core';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import {
  type DashboardClientConfiguration,
  type DashboardIotSiteWiseQueries,
} from '../../types';
import { getClients } from './getClients';

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
