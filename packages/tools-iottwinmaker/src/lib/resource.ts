import * as fsPromises from 'fs/promises';

import { getDefaultAwsClients as aws } from './aws-clients';

/**
 * Resource creation function used for TMDT deployment
 * @param workspaceId TM workspace
 * @param filePath string path of resources
 * @param destination model file
 * @returns s3url promise
 */
async function importResource(workspaceId: string, filePath: string, destination: string) {
  const ws = await aws().tm.getWorkspace({ workspaceId });
  const s3Arn = ws.s3Location;

  // TODO: this logic doesn't work on non aws regions (e.g. gov)
  const s3Bucket = s3Arn?.replace('arn:aws:s3:::', '');
  const s3Url = `s3://${s3Bucket}/${destination}`;

  console.log(`Uploading ${filePath} to ${s3Url}`);

  const buffer = await fsPromises.readFile(filePath);

  await aws().s3.putObject({
    Bucket: s3Bucket,
    Key: destination,
    Body: buffer,
  });

  console.log(`Uploaded ${filePath}`);

  return s3Url;
}

export { importResource };
