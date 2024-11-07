import {
  type IoTSiteWiseClient,
  paginateListAssetProperties,
  paginateListAssetModelProperties,
  type IoTSiteWisePaginationConfiguration,
  type ListAssetPropertiesCommandInput,
  type ListAssetModelPropertiesCommandInput,
  type ListAssetPropertiesCommandOutput,
  type ListAssetModelPropertiesCommandOutput,
  type AssetPropertySummary,
  type AssetModelPropertySummary,
} from '@aws-sdk/client-iotsitewise';
import type { ModeledDataStream } from '../types';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';
import { DEFAULT_STRING } from '~/components/queryEditor/contants';
import { type Paginator } from '@aws-sdk/types';
import { type SelectedAsset } from '../../types';

export class listModeledDataStreamsRequestWithCompositeModels {
  readonly #listAssetPropertyPaginator: Paginator<
    ListAssetPropertiesCommandOutput | undefined
  >;
  readonly #listAssetModelPropertyPaginator: Paginator<
    ListAssetModelPropertiesCommandOutput | undefined
  >;
  #signal: AbortSignal | undefined;

  constructor({
    selectedAsset,
    client,
    signal,
  }: {
    selectedAsset: SelectedAsset;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#listAssetPropertyPaginator = this.#createAssetPropertyPaginator(
      { client },
      { assetId: selectedAsset.assetId, filter: 'ALL' }
    );
    this.#listAssetModelPropertyPaginator =
      this.#createAssetModelPropertyPaginator(
        { client },
        { assetModelId: selectedAsset.assetModelId, filter: 'ALL' }
      );
    this.#signal = signal;
  }

  public async send() {
    try {
      //get all assetProperties
      const assetProperties: AssetPropertySummary[] = [];
      for await (const result of this.#listAssetPropertyPaginator) {
        if (this.#signal?.aborted) {
          break;
        }

        assetProperties.push(...(result?.assetPropertySummaries ?? []));
      }

      //get all assetModelProperties
      const assetModelPropertiesMap: {
        [x: string]: AssetModelPropertySummary;
      } = {};
      for await (const result of this.#listAssetModelPropertyPaginator) {
        if (this.#signal?.aborted) {
          break;
        }
        const assetModelPropertySummaries =
          result?.assetModelPropertySummaries ?? [];
        assetModelPropertySummaries.forEach((modelSummary) => {
          if (modelSummary.id) {
            assetModelPropertiesMap[modelSummary.id] = modelSummary;
          }
        });
      }

      const modeledDataStreams = this.#formatDataStreams({
        assetProperties,
        assetModelPropertiesMap,
      });
      return modeledDataStreams;
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

  #formatDataStreams({
    assetProperties,
    assetModelPropertiesMap,
  }: {
    assetProperties: AssetPropertySummary[];
    assetModelPropertiesMap: { [x: string]: AssetModelPropertySummary };
  }): ModeledDataStream[] {
    const allProperties: (AssetPropertySummary & AssetModelPropertySummary)[] =
      assetProperties.map((assetSummary) => {
        const modelSummary = assetModelPropertiesMap[assetSummary.id ?? ''];
        return {
          ...modelSummary,
          ...assetSummary, // this goes second so the type property is overwritten correctly
        };
      });
    const nonNullableProperties = createNonNullableList(allProperties);

    const allPropertiesWithAssetDetail =
      nonNullableProperties.map<ModeledDataStream>(
        ({
          path,
          id: propertyId = DEFAULT_STRING,
          name = DEFAULT_STRING,
          unit = DEFAULT_STRING,
          dataType = undefined as NonNullable<undefined>,
          dataTypeSpec = DEFAULT_STRING,
        }) => ({
          assetId: path?.at(0)?.id ?? '-',
          assetName: path?.at(0)?.name ?? '-',
          propertyId,
          name,
          unit,
          dataType,
          dataTypeSpec,
        })
      );

    return allPropertiesWithAssetDetail;
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
