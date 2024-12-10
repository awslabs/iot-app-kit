import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { isCredentials } from '../../hooks/useAWSRegion';
import { type DashboardClientConfiguration } from '../../types';
import { type DashboardClientContext } from './clientContext';

export const getClients = (
  dashboardClientConfiguration: DashboardClientConfiguration
): DashboardClientContext => {
  if (!isCredentials(dashboardClientConfiguration)) {
    return {
      ...dashboardClientConfiguration,
      iotSiteWise: new IoTSiteWise({
        credentials:
          dashboardClientConfiguration.iotSiteWiseClient.config.credentials,
        region: dashboardClientConfiguration.iotSiteWiseClient.config.region,
      }),
    };
  }

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
  const iotSiteWise = new IoTSiteWise({
    credentials: dashboardClientConfiguration.awsCredentials,
    region: dashboardClientConfiguration.awsRegion,
  });

  return {
    iotEventsClient,
    iotSiteWiseClient,
    iotTwinMakerClient,
    iotSiteWise,
  };
};
