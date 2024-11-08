import {
  DescribeAssetCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { type StyleSettingsMap } from '@iot-app-kit/core';
import { toId } from '@iot-app-kit/source-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { useClients } from '~/components/dashboard/clientContext';
import { type SiteWiseQueryConfig } from '../types';

export const useTableItems = (
  query: SiteWiseQueryConfig['query'],
  styles: StyleSettingsMap
) => {
  const { iotSiteWiseClient } = useClients();

  const assets = query?.assets ?? [];
  const assetIds = assets.map(({ assetId }) => assetId);

  const queries = useQueries({
    queries: iotSiteWiseClient
      ? assetIds.map((assetId) => ({
          enabled: Boolean(assetId),
          queryKey: new AssetCacheKeyFactory(assetId).create(),
          queryFn: createQueryFn(iotSiteWiseClient),
        }))
      : [],
  });

  const assetItems = assets.flatMap(({ assetId, properties }) =>
    properties
      .map(({ propertyId, refId }) => {
        const assetDescription = queries.find(
          ({ data }) => data?.assetId === assetId
        )?.data;
        const { unit, name } = assetDescription?.assetProperties?.find(
          ({ id }) => id === propertyId
        ) ?? { unit: '' };
        return {
          //if refId is undefined, use property name
          property:
            styles[refId ?? ''].name ??
            `${name} (${assetDescription?.assetName ?? ''})`,
          unit,
          value: {
            $cellRef: {
              id: toId({
                assetId,
                propertyId,
              }),
              resolution: 0,
            },
          },
        };
      })
      .filter((property) => !property.property.includes('undefined'))
  );

  const unmodeledItems =
    query?.properties?.map(({ propertyAlias }) => ({
      property: propertyAlias,
      unit: '',
      value: {
        $cellRef: {
          id: propertyAlias,
          resolution: 0,
        },
      },
    })) ?? [];

  return [...assetItems, ...unmodeledItems];
};

export class AssetCacheKeyFactory {
  #assetId: string | undefined;

  constructor(assetId?: string) {
    this.#assetId = assetId;
  }

  create() {
    const cacheKey = [{ resource: 'asset', assetId: this.#assetId }] as const;

    return cacheKey;
  }
}

function isEnabled(assetId: string | undefined): assetId is string {
  return Boolean(assetId);
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<ReturnType<AssetCacheKeyFactory['create']>>) {
    invariant(
      isEnabled(assetId),
      'Expected assetId to be defined as required by the enabled flag.'
    );

    const request = new GetAssetRequest({ assetId, client, signal });
    const response = await request.send();

    return response;
  };
}

export class GetAssetRequest {
  readonly #command: DescribeAssetCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({
    assetId,
    client,
    signal,
  }: {
    assetId: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand(assetId);
    this.#client = client;
    this.#signal = signal;
  }

  public async send() {
    try {
      const response = await this.#client.send(this.#command, {
        abortSignal: this.#signal,
      });

      return response;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand(assetId: string) {
    const command = new DescribeAssetCommand({ assetId });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get asset description. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
