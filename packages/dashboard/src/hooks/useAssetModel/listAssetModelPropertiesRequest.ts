import {
  type IoTSiteWiseClient,
  type IoTSiteWisePaginationConfiguration,
  type ListAssetModelPropertiesCommandInput,
  type ListAssetModelPropertiesCommandOutput,
  type ListAssetPropertiesCommandInput,
  paginateListAssetModelProperties,
  paginateListAssetProperties,
} from '@aws-sdk/client-iotsitewise';
import { type Paginator } from '@aws-sdk/types';
import { compact } from '~/helpers/lists/compact';

export class listAssetModelPropertiesRequest {
  readonly #listAssetModelPropertyPaginator: Paginator<
    ListAssetModelPropertiesCommandOutput | undefined
  >;
  #signal: AbortSignal | undefined;

  constructor({
    assetModelId,
    client,
    signal,
  }: {
    assetModelId: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#listAssetModelPropertyPaginator =
      this.#createAssetModelPropertyPaginator(
        { client },
        { assetModelId: assetModelId, filter: 'ALL' }
      );
    this.#signal = signal;
  }

  public async send() {
    try {
      //get all assetModelProperties
      const assetModelPropertiesList = [];
      for await (const result of this.#listAssetModelPropertyPaginator) {
        if (this.#signal?.aborted) {
          break;
        }
        const assetModelPropertySummaries =
          result?.assetModelPropertySummaries ?? [];
        assetModelPropertiesList.push(...assetModelPropertySummaries);
      }

      return compact(assetModelPropertiesList);
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createAssetPropertyPaginator(
    paginatorConfig: IoTSiteWisePaginationConfiguration,
    commandParams: ListAssetPropertiesCommandInput
  ) {
    return paginateListAssetProperties(paginatorConfig, commandParams);
  }

  #createAssetModelPropertyPaginator(
    paginatorConfig: IoTSiteWisePaginationConfiguration,
    commandParams: ListAssetModelPropertiesCommandInput
  ) {
    return paginateListAssetModelProperties(paginatorConfig, commandParams);
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get asset description. Error: ${error}`);
    console.info('Request input:');
    console.table(
      this.#createAssetModelPropertyPaginator.arguments,
      this.#createAssetPropertyPaginator.arguments
    );

    throw error;
  }
}
