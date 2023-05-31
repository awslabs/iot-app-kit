import { initialize } from '@iot-app-kit/source-iottwinmaker';

const workspaceId = 'test';
const awsCredentials = {
  accessKeyId: 'ASIAZJPPXXXXXX',
  secretAccessKey: 'ASIAZJPPXXXXXX',
  sessionToken: 'IQoJb3JpZ2lu//////////',
};
const region = 'us-east-1';

const dataSource = initialize(workspaceId, {
  awsCredentials,
  awsRegion: region,
});
export const kgDataSource = dataSource.kGDatamodule();
