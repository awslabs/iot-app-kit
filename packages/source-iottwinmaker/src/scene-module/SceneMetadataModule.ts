import {
  GetSceneCommand,
  GetSceneCommandOutput,
  IoTTwinMakerClient,
  UpdateSceneCommand,
} from '@aws-sdk/client-iottwinmaker';
import { ListSecretsCommand, SecretListEntry, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { TwinMakerSceneMetadataModule } from '../types';

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

  updateScene = async (capabilities?: string[], sceneMetadata?: Record<string, string>): Promise<void> => {
    await this.twinMakerClient.send(
      new UpdateSceneCommand({
        workspaceId: this.workspaceId,
        sceneId: this.sceneId,
        capabilities: capabilities,
        sceneMetadata: sceneMetadata,
      })
    );
  };

  get3pConnectionList = async (connectionTag: string): Promise<SecretListEntry[] | undefined> => {
    if (!this.secretsManagerClient) return undefined;

    const listSecretsResponse = await this.secretsManagerClient?.send(
      new ListSecretsCommand({ Filters: [{ Key: 'tag-key', Values: [connectionTag] }] })
    );
    return listSecretsResponse.SecretList;
  };
}
