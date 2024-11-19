import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import {
  IoTSiteWiseClient,
  IoTSiteWise,
  IoTSiteWise as InternalIoTSiteWise,
} from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { type DashboardClientConfiguration } from '~/types';
import { type DashboardClientContext } from './clientContext';
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

  // This is required to set endpoint for Pen Test
  const assistantEndpointMetadata = document.querySelector(
    'meta[name="assistantEndpoint"]'
  ) as HTMLMetaElement;
  const iotSiteWisePrivateClient = new InternalIoTSiteWise({
    credentials: dashboardClientConfiguration.awsCredentials,
    region: dashboardClientConfiguration.awsRegion,
    endpoint:
      assistantEndpointMetadata?.content ??
      `https://data.iotsitewise.${region}.amazonaws.com`,
  });

  return {
    iotEventsClient,
    iotSiteWiseClient,
    iotTwinMakerClient,
    iotSiteWise,
    iotSiteWisePrivateClient,
  };
};
