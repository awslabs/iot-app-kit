/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetEntityCommand,
  IoTTwinMakerClient,
  ListEntitiesCommand,
} from '@aws-sdk/client-iottwinmaker';
import type {
  EntitySummary,
  GetEntityResponse,
  ListEntitiesResponse,
} from '@aws-sdk/client-iottwinmaker';
import type { ErrorDetails } from '@iot-app-kit/core';
import { QueryClient } from '@tanstack/query-core';
import { isDefined } from '../utils/propertyValueUtils';

export class TwinMakerMetadataModule {
  private readonly workspaceId: string;
  private readonly tmClient: IoTTwinMakerClient;
  private readonly cachedQueryClient: QueryClient;

  constructor(
    workspaceId: string,
    client: IoTTwinMakerClient,
    cachedQueryClient: QueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
        },
      },
    })
  ) {
    this.workspaceId = workspaceId;
    this.tmClient = client;
    this.cachedQueryClient = cachedQueryClient;
  }

  fetchEntity = async ({
    entityId,
  }: {
    entityId: string;
  }): Promise<GetEntityResponse> => {
    const request = new GetEntityCommand({
      workspaceId: this.workspaceId,
      entityId,
    });

    try {
      const response = await this.cachedQueryClient.fetchQuery({
        queryKey: ['get-entity', this.workspaceId, entityId],
        queryFn: () => this.tmClient.send(request),
      });

      return response;
    } catch (err: any) {
      const errorDetail: ErrorDetails = {
        msg: err.message,
        type: err.name,
        status: err.$metadata?.httpStatusCode,
      };

      throw errorDetail;
    }
  };

  fetchEntitiesByComponentTypeId = async ({
    componentTypeId,
  }: {
    componentTypeId: string | undefined;
  }): Promise<GetEntityResponse[]> => {
    return this.cachedQueryClient.fetchQuery({
      queryKey: [
        'list-entities-by-component-type-id',
        this.workspaceId,
        componentTypeId,
      ],
      queryFn: async () => {
        const summaries = await this._requestEntitiesByComponentTypeId({
          componentTypeId,
        });

        const requests = summaries.map((summary) =>
          summary.entityId
            ? this.fetchEntity({ entityId: summary.entityId })
            : undefined
        );

        return (await Promise.all(requests)).filter(isDefined);
      },
    });
  };

  fetchEntitiesSummaries = async (): Promise<EntitySummary[]> => {
    return this.cachedQueryClient.fetchQuery({
      queryKey: ['list-entities', this.workspaceId],
      queryFn: () =>
        this._requestEntitiesByComponentTypeId({
          componentTypeId: undefined,
        }),
    });
  };

  private _requestEntitiesByComponentTypeId = async ({
    componentTypeId,
  }: {
    componentTypeId: string | undefined;
  }): Promise<EntitySummary[]> => {
    try {
      const summaries = [];

      let nextToken = undefined;
      do {
        const response: ListEntitiesResponse = await this.tmClient.send(
          new ListEntitiesCommand({
            workspaceId: this.workspaceId,
            nextToken,
            filters: componentTypeId ? [{ componentTypeId }] : undefined,
          })
        );
        nextToken = response.nextToken;
        summaries.push(...(response.entitySummaries || []));
      } while (nextToken);

      return summaries;
    } catch (err: any) {
      const errorDetail: ErrorDetails = {
        msg: err.message,
        type: err.name,
        status: err.$metadata?.httpStatusCode,
      };

      throw errorDetail;
    }
  };
}
