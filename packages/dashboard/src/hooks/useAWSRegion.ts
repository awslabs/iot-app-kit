import type {
  DashboardClientConfiguration,
  DashboardClientCredentials,
} from '~/features/queries/sdk-clients';

export const isCredentials = (
  dashboardClientConfiguration: DashboardClientConfiguration
): dashboardClientConfiguration is DashboardClientCredentials =>
  'awsCredentials' in dashboardClientConfiguration &&
  'awsRegion' in dashboardClientConfiguration;
