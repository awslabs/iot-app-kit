import { useEffect, useState } from 'react';
import {
  type DashboardClientConfiguration,
  type DashboardClientCredentials,
} from '~/types/sdk-clients';

export const isCredentials = (
  dashboardClientConfiguration: DashboardClientConfiguration
): dashboardClientConfiguration is DashboardClientCredentials =>
  'awsCredentials' in dashboardClientConfiguration &&
  'awsRegion' in dashboardClientConfiguration;

export const useAWSRegion = (
  dashboardClientConfiguration: DashboardClientConfiguration
) => {
  const [region, setRegion] = useState<string>('');

  useEffect(() => {
    let awsRegion;
    if (isCredentials(dashboardClientConfiguration)) {
      awsRegion = dashboardClientConfiguration.awsRegion;
    } else {
      awsRegion = dashboardClientConfiguration.iotSiteWiseClient.config.region;
    }

    if (typeof awsRegion === 'string') {
      setRegion(awsRegion);
    } else {
      awsRegion().then((value) => setRegion(value));
    }
  }, [dashboardClientConfiguration]);

  return {
    region,
  };
};
