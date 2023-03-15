import {
  GetSceneCommand,
  GetSceneCommandOutput,
  GetWorkspaceCommand,
  GetWorkspaceCommandOutput,
  IoTTwinMakerClient,
} from '@aws-sdk/client-iottwinmaker';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SceneLoader } from '../types';
import { getS3BucketAndKey, parseS3BucketFromArn, parseS3RelativeScenePathFromURI } from '../utils/s3Utils';

export class S3SceneLoader implements SceneLoader {
  private workspaceId: string;
  private sceneId: string;
  private twinMakerClient: IoTTwinMakerClient;
  private s3Client: S3Client;

  constructor(input: {
    workspaceId: string;
    sceneId: string;
    twinMakerClient: IoTTwinMakerClient;
    s3Client: S3Client;
  }) {
    this.workspaceId = input.workspaceId;
    this.sceneId = input.sceneId;
    this.twinMakerClient = input.twinMakerClient;
    this.s3Client = input.s3Client;
  }

  getSceneUri = async (): Promise<string | null> => {
    const promises: [Promise<GetWorkspaceCommandOutput>, Promise<GetSceneCommandOutput>] = [
      this.twinMakerClient.send(new GetWorkspaceCommand({ workspaceId: this.workspaceId })),
      this.twinMakerClient.send(new GetSceneCommand({ workspaceId: this.workspaceId, sceneId: this.sceneId })),
    ];

    const [workspace, scene] = await Promise.all(promises);

    const scenePath = scene.contentLocation ? parseS3RelativeScenePathFromURI(scene.contentLocation) : undefined;
    const sceneFileBucket = workspace.s3Location ? parseS3BucketFromArn(workspace.s3Location) : undefined;

    return scenePath && sceneFileBucket ? `s3://${sceneFileBucket}/${scenePath}` : null;
  };

  getSceneObject = (uri: string): Promise<ArrayBuffer> | null => {
    const s3BucketAndKey = getS3BucketAndKey(uri);
    if (!s3BucketAndKey) return null;

    return new Promise((resolve, reject) => {
      this.s3Client
        .send(new GetObjectCommand(s3BucketAndKey))
        .then(async (data) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const res = await new Response(data.Body as any).arrayBuffer();
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
