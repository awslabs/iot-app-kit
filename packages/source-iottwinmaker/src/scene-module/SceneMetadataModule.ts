import {
  CreateEntityCommand,
  type CreateEntityCommandInput,
  DeleteEntityCommand,
  type DeleteEntityCommandInput,
  GetEntityCommand,
  type GetEntityCommandInput,
  GetSceneCommand,
  type GetSceneCommandOutput,
  type IoTTwinMakerClient,
  UpdateEntityCommand,
  type UpdateEntityCommandInput,
  UpdateSceneCommand,
  CreateSceneCommand,
} from '@aws-sdk/client-iottwinmaker';
import {
  ListSecretsCommand,
  type SecretListEntry,
  type SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  type SceneInfo,
  type TwinMakerKGQueryDataModule,
  type TwinMakerSceneMetadataModule,
} from '../types';

export class SceneMetadataModule implements TwinMakerSceneMetadataModule {
  private workspaceId: string;
  private sceneId: string;
  private twinMakerClient: IoTTwinMakerClient;
  private secretsManagerClient?: SecretsManagerClient;
  private _kgModule: TwinMakerKGQueryDataModule;

  constructor(input: {
    workspaceId: string;
    sceneId: string;
    twinMakerClient: IoTTwinMakerClient;
    secretsManagerClient?: SecretsManagerClient;
    kgModule: TwinMakerKGQueryDataModule;
  }) {
    this.workspaceId = input.workspaceId;
    this.sceneId = input.sceneId;
    this.twinMakerClient = input.twinMakerClient;
    this.secretsManagerClient = input.secretsManagerClient;
    this._kgModule = input.kgModule;
  }

  get kgModule(): TwinMakerKGQueryDataModule {
    return this._kgModule;
  }

  getSceneId = (): string => {
    return this.sceneId;
  };

  getSceneInfo = async (): Promise<GetSceneCommandOutput> => {
    const sceneInfo: GetSceneCommandOutput = await this.twinMakerClient.send(
      new GetSceneCommand({
        workspaceId: this.workspaceId,
        sceneId: this.sceneId,
      })
    );

    return sceneInfo;
  };

  updateSceneInfo = async (sceneInfo: SceneInfo): Promise<void> => {
    await this.twinMakerClient.send(
      new UpdateSceneCommand({
        ...sceneInfo,
        workspaceId: this.workspaceId,
        sceneId: this.sceneId,
      })
    );
  };

  get3pConnectionList = (
    connectionTag: string
  ): Promise<SecretListEntry[] | undefined> | null => {
    if (!this.secretsManagerClient) return null;

    return new Promise((resolve, reject) => {
      this.secretsManagerClient
        ?.send(
          new ListSecretsCommand({
            Filters: [{ Key: 'tag-key', Values: [connectionTag] }],
          })
        )
        .then(async (listSecretsResponse) => {
          resolve(listSecretsResponse.SecretList);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getSceneEntity = (input: Omit<GetEntityCommandInput, 'workspaceId'>) => {
    return this.twinMakerClient.send(
      new GetEntityCommand({ ...input, workspaceId: this.workspaceId })
    );
  };

  createSceneEntity = (
    input: Omit<CreateEntityCommandInput, 'workspaceId'>
  ) => {
    return this.twinMakerClient.send(
      new CreateEntityCommand({ ...input, workspaceId: this.workspaceId })
    );
  };

  updateSceneEntity = (
    input: Omit<UpdateEntityCommandInput, 'workspaceId'>
  ) => {
    return this.twinMakerClient.send(
      new UpdateEntityCommand({ ...input, workspaceId: this.workspaceId })
    );
  };

  deleteSceneEntity = (
    input: Omit<DeleteEntityCommandInput, 'workspaceId'>
  ) => {
    return this.twinMakerClient.send(
      new DeleteEntityCommand({ ...input, workspaceId: this.workspaceId })
    );
  };

  createScene = async (sceneInfo: SceneInfo): Promise<void> => {
    await this.twinMakerClient.send(
      new CreateSceneCommand({
        workspaceId: this.workspaceId,
        sceneId: this.sceneId,
        contentLocation: undefined,
        capabilities: sceneInfo.capabilities,
        sceneMetadata: sceneInfo.sceneMetadata,
      })
    );
  };
}
