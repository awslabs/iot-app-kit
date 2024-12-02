import {
  paginateListAssetModelProperties,
  paginateListAssetProperties,
  type IoTSiteWiseClient,
  type IoTSiteWisePaginationConfiguration,
  type ListAssetModelPropertiesCommandInput,
  type ListAssetModelPropertiesCommandOutput,
  type ListAssetPropertiesCommandInput,
} from '@aws-sdk/client-iotsitewise';
import { type Paginator } from '@aws-sdk/types';
import { createNonNullableList } from '@iot-app-kit/helpers/lists/createNonNullableList';

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

      // const modeledDataStreams = this.#formatDataStreams({ assetProperties, assetModelPropertiesMap });
      const nonNullableProperties = createNonNullableList(
        assetModelPropertiesList
      );
      return nonNullableProperties;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createAssetPropertyPaginator(
    paginatorConfig: IoTSiteWisePaginationConfiguration,
    commandParams: ListAssetPropertiesCommandInput
  ) {
    const paginator = paginateListAssetProperties(
      paginatorConfig,
      commandParams
    );
    return paginator;
  }

  #createAssetModelPropertyPaginator(
    paginatorConfig: IoTSiteWisePaginationConfiguration,
    commandParams: ListAssetModelPropertiesCommandInput
  ) {
    const paginator = paginateListAssetModelProperties(
      paginatorConfig,
      commandParams
    );
    return paginator;
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
