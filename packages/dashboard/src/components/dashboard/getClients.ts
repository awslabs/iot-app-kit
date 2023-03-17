import { getSiteWiseClient, getIotEventsClient } from '@iot-app-kit/core-util';
import { DashboardClientConfiguration, DashboardIotSiteWiseClients, DashboardClientCredentials } from '~/types';

export const isCredentials = (
  dashboardClientConfiguration: DashboardClientConfiguration
): dashboardClientConfiguration is DashboardClientCredentials =>
  'awsCredentials' in dashboardClientConfiguration && 'awsRegion' in dashboardClientConfiguration;

export const getClients = (dashboardClientConfiguration: DashboardClientConfiguration): DashboardIotSiteWiseClients => {
  if (!isCredentials(dashboardClientConfiguration)) return dashboardClientConfiguration;

  return {
    iotEventsClient: getIotEventsClient(dashboardClientConfiguration),
    iotSiteWiseClient: getSiteWiseClient(dashboardClientConfiguration),
  };
};
