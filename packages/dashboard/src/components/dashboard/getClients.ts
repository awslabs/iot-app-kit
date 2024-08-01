import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import IoTSiteWise from '@amzn/iot-sitewise-sdk/clients/iotsitewise';
import {
  DashboardClientConfiguration,
  DashboardIotSiteWiseClients,
  DashboardClientCredentials,
} from '~/types';

export const isCredentials = (
  dashboardClientConfiguration: DashboardClientConfiguration
): dashboardClientConfiguration is DashboardClientCredentials =>
  'awsCredentials' in dashboardClientConfiguration &&
  'awsRegion' in dashboardClientConfiguration;

export const getClients = (
  dashboardClientConfiguration: DashboardClientConfiguration
): DashboardIotSiteWiseClients => {
  if (!isCredentials(dashboardClientConfiguration))
    return dashboardClientConfiguration;

  const iotEventsClient = new IoTEventsClient({
    credentials: dashboardClientConfiguration.awsCredentials,
    region: dashboardClientConfiguration.awsRegion,
  });
  const iotSiteWiseClient = new IoTSiteWiseClient({
    credentials: dashboardClientConfiguration.awsCredentials,
    region: dashboardClientConfiguration.awsRegion,
  });
  const iotTwinMakerClient = new IoTTwinMakerClient({
    credentials: dashboardClientConfiguration.awsCredentials,
    region: dashboardClientConfiguration.awsRegion,
  });

  const iotSiteWisePrivateClient = new IoTSiteWise({
    credentials: dashboardClientConfiguration.awsCredentials as any,
    region: dashboardClientConfiguration.awsRegion as string,
    endpoint: 'https://data.beta.us-east-1.iotsitewise.amazonaws.com',
  });

  return {
    iotEventsClient,
    iotSiteWiseClient,
    iotTwinMakerClient,
    iotSiteWisePrivateClient,
  };
};
