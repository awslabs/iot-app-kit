import {
  GetSceneCommand,
  GetSceneCommandOutput,
  IoTTwinMakerClient,
  UpdateSceneCommand,
} from '@aws-sdk/client-iottwinmaker';
import { ListSecretsCommand, SecretListEntry, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { SceneInfo, TwinMakerSceneMetadataModule } from '../types';

export class SceneMetadataModule implements TwinMakerSceneMetadataModule {
  private workspaceId: string;
  private sceneId: string;
  private twinMakerClient: IoTTwinMakerClient;
  private secretsManagerClient?: SecretsManagerClient;

  constructor(input: {
    workspaceId: string;
    sceneId: string;
    twinMakerClient: IoTTwinMakerClient;
    secretsManagerClient?: SecretsManagerClient;
  }) {
    this.workspaceId = input.workspaceId;
    this.sceneId = input.sceneId;
    this.twinMakerClient = input.twinMakerClient;
    this.secretsManagerClient = input.secretsManagerClient;
  }

  getSceneInfo = async (): Promise<GetSceneCommandOutput> => {
    const sceneInfo: GetSceneCommandOutput = await this.twinMakerClient.send(
      new GetSceneCommand({ workspaceId: this.workspaceId, sceneId: this.sceneId })
    );

    return sceneInfo;
  };

  updateSceneInfo = async (sceneInfo: SceneInfo): Promise<void> => {
    await this.twinMakerClient.send(
      new UpdateSceneCommand({
        workspaceId: this.workspaceId,
        sceneId: this.sceneId,
        capabilities: sceneInfo.capabilities,
        sceneMetadata: sceneInfo.sceneMetadata,
      })
    );
  };

  get3pConnectionList = (connectionTag: string): Promise<SecretListEntry[] | undefined> | null => {
    if (!this.secretsManagerClient) return null;

    return new Promise((resolve, reject) => {
      this.secretsManagerClient
        ?.send(new ListSecretsCommand({ Filters: [{ Key: 'tag-key', Values: [connectionTag] }] }))
        .then(async (listSecretsResponse) => {
          resolve(listSecretsResponse.SecretList);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
