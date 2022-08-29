import { GetEntityCommand, GetEntityResponse, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { ErrorDetails } from '@iot-app-kit/core';
import { TwinMakerMetadataCache } from './TwinMakerMetadataCache';

export class TwinMakerMetadataModule {
  private readonly workspaceId: string;
  private readonly tmClient: IoTTwinMakerClient;
  private readonly cache: TwinMakerMetadataCache;

  constructor(
    workspaceId: string,
    client: IoTTwinMakerClient,
    cache: TwinMakerMetadataCache = new TwinMakerMetadataCache()
  ) {
    this.workspaceId = workspaceId;
    this.tmClient = client;
    this.cache = cache;
  }

  async fetchEntity({ entityId }: { entityId: string }): Promise<GetEntityResponse> {
    const cachedEntity = this.cache.getEntity(entityId);
    if (cachedEntity) {
      return cachedEntity;
    }

    try {
      // TODO: combine same requests into one
      return await this.tmClient.send(
        new GetEntityCommand({
          workspaceId: this.workspaceId,
          entityId,
        })
      );
    } catch (err: any) {
      const errorDetail: ErrorDetails = { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode };

      throw errorDetail;
    }
  }
}
