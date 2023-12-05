import {
  ListAssetModelPropertiesCommand,
  type IoTSiteWiseClient,
  type ListAssetModelPropertiesCommandInput,
} from '@aws-sdk/client-iotsitewise';

import type { AssetModelId, AssetModelProperty, AssetModelPropertyId } from './types';

interface CacheItem {
  assetModelProperties: AssetModelProperty[];
  nextToken: string | undefined;
}
type Cache = Record<AssetModelId, CacheItem>;

export class SearchAssetModelPropertyRequest {
  #cache: Cache = {};
  #client: IoTSiteWiseClient;

  constructor(client: IoTSiteWiseClient) {
    this.#client = client;
  }

  public async send({
    assetModelPropertyId,
    assetModelId,
  }: {
    assetModelPropertyId: AssetModelPropertyId;
    assetModelId: AssetModelId;
  }): Promise<AssetModelProperty | undefined | never> {
    // see if asset model property is cached
    if (this.#cache[assetModelId]?.assetModelProperties) {
      const foundAssetModelProperty = this.#findAssetModelProperty({
        assetModelPropertyId,
        assetModelProperties: this.#cache[assetModelId].assetModelProperties,
      });

      if (foundAssetModelProperty) {
        return foundAssetModelProperty;
      }
    }

    // asset model property does not exist
    if (this.#cache[assetModelId]?.assetModelProperties && !this.#cache[assetModelId].nextToken) {
      return undefined;
    }

    try {
      do {
        const command = this.#createCommand({ assetModelId, nextToken: this.#cache[assetModelId]?.nextToken });
        const { assetModelPropertySummaries: newAssetModelProperties = [], nextToken: newNextToken } =
          await this.#client.send(command);

        if (this.#cache[assetModelId]) {
          this.#cache[assetModelId].assetModelProperties.push(...newAssetModelProperties);
          this.#cache[assetModelId].nextToken = newNextToken;
        } else {
          this.#cache[assetModelId] = {
            assetModelProperties: newAssetModelProperties,
            nextToken: newNextToken,
          };
        }

        const foundAssetModelProperty = this.#findAssetModelProperty({
          assetModelPropertyId,
          assetModelProperties: this.#cache[assetModelId].assetModelProperties,
        });

        if (foundAssetModelProperty) {
          return foundAssetModelProperty;
        }
      } while (this.#cache[assetModelId].nextToken);
    } catch (error) {
      this.#handleError(error);
    }
  }

  #findAssetModelProperty({
    assetModelPropertyId,
    assetModelProperties,
  }: {
    assetModelPropertyId: AssetModelPropertyId;
    assetModelProperties: AssetModelProperty[];
  }): AssetModelProperty | undefined {
    const assetModelProperty = assetModelProperties.find(({ id }) => id === assetModelPropertyId);

    return assetModelProperty;
  }

  #createCommand(input: Pick<ListAssetModelPropertiesCommandInput, 'assetModelId' | 'nextToken'>) {
    const FILTER = 'ALL';
    const MAX_RESULTS = 250;
    const command = new ListAssetModelPropertiesCommand({ ...input, filter: FILTER, maxResults: MAX_RESULTS });

    return command;
  }

  #handleError(error: unknown) {
    console.error(`Failed to list asset model properties. Error: ${error}`);

    throw error;
  }
}
