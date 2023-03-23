import * as path from 'path';
import * as fsPromises from 'fs/promises';

import { getDefaultAwsClients as aws } from './aws-clients';
import { ListScenesCommandOutput } from '@aws-sdk/client-iottwinmaker';

/**
 * Scene import function used for TMDT deployment
 * @param workspaceId TM workspace
 * @param sceneFilePath string file path
 * @param workspaceContentBucket workspace content bucket
 */
async function importScene(workspaceId: string, sceneFilePath: string, workspaceContentBucket: string) {
  const ws = await aws().tm.getWorkspace({ workspaceId });
  const s3Arn = ws.s3Location;

  // TODO: this logic doesn't work on non aws regions (e.g. gov)
  const s3Bucket = s3Arn?.replace('arn:aws:s3:::', '');

  const sceneName = path.basename(sceneFilePath, '.json');
  const sceneContent = (await fsPromises.readFile(sceneFilePath)).toString();

  // replace URIs with reference to new content bucket
  const sceneJson = JSON.parse(`${sceneContent}`);
  for (const n of sceneJson['nodes']) {
    for (const c of n['components']) {
      if (c['type'] == 'ModelRef') {
        if (!c['uri'].startsWith('s3://')) {
          // update reference to be absolute to content bucket
          c['uri'] = `s3://${workspaceContentBucket}/${c['uri']}`;
        }
      }
    }
  }
  const sceneContentWithUpdatedUriRefs = JSON.stringify(sceneJson, null, 4);

  await aws().tm.createScene({
    workspaceId,
    sceneId: sceneName,
    contentLocation: `s3://${s3Bucket}/${sceneName}.json`,
  });

  await aws().s3.putObject({
    Bucket: s3Bucket,
    Key: sceneName + '.json',
    Body: sceneContentWithUpdatedUriRefs,
    ContentType: 'application/json',
  });

  console.log(`Uploaded ${sceneFilePath} to s3://${s3Bucket}/${sceneName}.json`);
}

/**
 * mass scene deletion for a TM workspace
 * @param workspaceId TM workspace
 */
async function deleteScenes(workspaceId: string) {
  let nextToken: string | undefined = '';
  while (nextToken != undefined) {
    const result: ListScenesCommandOutput = await aws().tm.listScenes({
      workspaceId: workspaceId,
      nextToken: nextToken,
    });
    nextToken = result['nextToken'];
    const sceneList = result['sceneSummaries'];
    if (sceneList != undefined) {
      for (const scene of sceneList) {
        const sceneId = scene['sceneId'];
        await aws().tm.deleteScene({
          workspaceId: workspaceId,
          sceneId: sceneId,
        });
        console.log(`deleted scene: ${sceneId}`);
      }
    }
  }
}

export { importScene, deleteScenes };
