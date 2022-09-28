import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { awsCredentials, region, workspaceId } from './configs';

export const dataSource = initialize(workspaceId, {
  awsCredentials,
  awsRegion: region,
});
