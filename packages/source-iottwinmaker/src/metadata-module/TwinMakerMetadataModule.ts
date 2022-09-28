/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EntitySummary,
  GetEntityCommand,
  GetEntityResponse,
  IoTTwinMakerClient,
  ListEntitiesCommand,
  ListEntitiesResponse,
} from '@aws-sdk/client-iottwinmaker';
import { ErrorDetails } from '@iot-app-kit/core';
import { isDefined } from '../time-series-data/utils/values';
import { TwinMakerMetadataCache } from './TwinMakerMetadataCache';

export class TwinMakerMetadataModule {
  private readonly workspaceId: string;
  private readonly tmClient: IoTTwinMakerClient;
  private readonly cache: TwinMakerMetadataCache;

  private readonly entityRequests: Record<string, Promise<GetEntityResponse>> = {};
  private readonly listEntitiesByComponentTypeIdRequests: Record<string, Promise<EntitySummary[]>> = {};

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
      if (this.entityRequests[entityId] === undefined) {
        this.entityRequests[entityId] = this.tmClient.send(
          new GetEntityCommand({
            workspaceId: this.workspaceId,
            entityId,
          })
        );
      }

      const response = await this.entityRequests[entityId];

      this.cache.storeEntity(response);
      delete this.entityRequests[entityId];

      return response;
    } catch (err: any) {
      const errorDetail: ErrorDetails = { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode };

      throw errorDetail;
    }
  }

  async fetchEntitiesByComponentTypeId({ componentTypeId }: { componentTypeId: string }): Promise<GetEntityResponse[]> {
    let summaries = this.cache.getEntitySummariesByComponentType(componentTypeId);

    if (!summaries) {
      if (this.listEntitiesByComponentTypeIdRequests[componentTypeId] === undefined) {
        this.listEntitiesByComponentTypeIdRequests[componentTypeId] = this._requestEntitiesByComponentTypeId({
          componentTypeId,
        });
      }

      summaries = await this.listEntitiesByComponentTypeIdRequests[componentTypeId];

      delete this.listEntitiesByComponentTypeIdRequests[componentTypeId];
    }

    const requests = summaries.map((summary) =>
      summary.entityId ? this.fetchEntity({ entityId: summary.entityId }) : undefined
    );
    return (await Promise.all(requests)).filter(isDefined);
  }

  private async _requestEntitiesByComponentTypeId({
    componentTypeId,
  }: {
    componentTypeId: string;
  }): Promise<EntitySummary[]> {
    try {
      const summaries = [];

      let nextToken = undefined;
      do {
        const response: ListEntitiesResponse = await this.tmClient.send(
          new ListEntitiesCommand({
            workspaceId: this.workspaceId,
            nextToken,
            filters: [{ componentTypeId }],
          })
        );
        nextToken = response.nextToken;
        summaries.push(...(response.entitySummaries || []));
      } while (nextToken);

      this.cache.storeEntitySummariesByComponentType(componentTypeId, summaries);

      return summaries;
    } catch (err: any) {
      const errorDetail: ErrorDetails = { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode };

      throw errorDetail;
    }
  }
}
