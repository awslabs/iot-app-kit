import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTSiteWiseClient, IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { IoTSiteWise as InternalIoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import { DashboardClientConfiguration } from '~/types';
import { DashboardClientContext } from './clientContext';
import { isCredentials } from '~/hooks/useAWSRegion';

export const getClients = (
  dashboardClientConfiguration: DashboardClientConfiguration,
  region: string
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

  const iotSiteWisePrivateClient = new InternalIoTSiteWise({
    credentials: dashboardClientConfiguration.awsCredentials,
    region: dashboardClientConfiguration.awsRegion,
    endpoint: `https://data.iotsitewise.${region}.amazonaws.com`,
  });

  return {
    iotEventsClient,
    iotSiteWiseClient,
    iotTwinMakerClient,
    iotSiteWise,
    iotSiteWisePrivateClient,
  };
};
