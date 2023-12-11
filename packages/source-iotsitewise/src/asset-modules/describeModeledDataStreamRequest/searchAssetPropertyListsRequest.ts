import {
  ListAssetPropertiesCommand,
  type IoTSiteWiseClient,
  type ListAssetPropertiesCommandInput,
} from '@aws-sdk/client-iotsitewise';

import type { AssetId, AssetProperty, AssetPropertyId } from './types';

interface CacheItem {
  assetProperties: AssetProperty[];
  nextToken: string | undefined;
}
type AssetPropertyCache = Record<AssetId, CacheItem>;

export class SearchAssetPropertyListsRequest {
  #cache: AssetPropertyCache = {};
  #client: IoTSiteWiseClient;

  constructor(client: IoTSiteWiseClient) {
    this.#client = client;
  }

  public async send({
    assetPropertyId,
    assetId,
  }: {
    assetPropertyId: AssetPropertyId;
    assetId: AssetId;
  }): Promise<AssetProperty | undefined | never> {
    // see if asset property is cached
    if (this.#cache[assetId]?.assetProperties) {
      const foundAssetProperty = this.#findAssetProperty({
        assetPropertyId,
        assetProperties: this.#cache[assetId].assetProperties,
      });

      if (foundAssetProperty) {
        return foundAssetProperty;
      }
    }

    // asset property does not exist
    if (this.#cache[assetId]?.assetProperties && !this.#cache[assetId].nextToken) {
      return undefined;
    }

    try {
      do {
        const command = this.#createCommand({ assetId, nextToken: this.#cache[assetId]?.nextToken });
        const { assetPropertySummaries: newAssetProperties = [], nextToken: newNextToken } = await this.#client.send(
          command
        );

        if (this.#cache[assetId]) {
          this.#cache[assetId].assetProperties.push(...newAssetProperties);
          this.#cache[assetId].nextToken = newNextToken;
        } else {
          this.#cache[assetId] = {
            assetProperties: newAssetProperties,
            nextToken: newNextToken,
          };
        }

        const foundAssetProperty = this.#findAssetProperty({
          assetPropertyId,
          assetProperties: this.#cache[assetId].assetProperties,
        });

        if (foundAssetProperty) {
          return foundAssetProperty;
        }
      } while (this.#cache[assetId].nextToken);
    } catch (error) {
      this.#handleError(error);
    }
  }

  #findAssetProperty({
    assetPropertyId,
    assetProperties,
  }: {
    assetPropertyId: AssetPropertyId;
    assetProperties: AssetProperty[];
  }): AssetProperty | undefined {
    const assetProperty = assetProperties.find(({ id }) => id === assetPropertyId);

    return assetProperty;
  }

  #createCommand(input: Pick<ListAssetPropertiesCommandInput, 'assetId' | 'nextToken'>) {
    const FILTER = 'ALL';
    const MAX_RESULTS = 250;
    const command = new ListAssetPropertiesCommand({ ...input, filter: FILTER, maxResults: MAX_RESULTS });

    return command;
  }

  #handleError(error: unknown): never {
    const errorMessage = `Failed to search asset property lists. Error: ${error}`;
    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}
