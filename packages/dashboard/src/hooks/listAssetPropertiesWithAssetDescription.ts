import {
  type AssetModelPropertySummary,
  DescribeAssetCommand,
  type IoTSiteWiseClient,
  type IoTSiteWisePaginationConfiguration,
  type ListAssetModelPropertiesCommandInput,
  type ListAssetPropertiesCommandInput,
  type ListAssetPropertiesCommandOutput,
  paginateListAssetModelProperties,
  paginateListAssetProperties,
} from '@aws-sdk/client-iotsitewise';
import { type Paginator } from '@aws-sdk/types';
import { compact } from '~/helpers/lists/compact';

export class listAssetPropertiesWithComposite {
  readonly #listAssetPropertyPaginator: Paginator<
    ListAssetPropertiesCommandOutput | undefined
  >;
  #signal: AbortSignal | undefined;
  #client: IoTSiteWiseClient;
  readonly #describeAssetCommand: DescribeAssetCommand;

  constructor({
    assetId,
    client,
    signal,
  }: {
    assetId: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#listAssetPropertyPaginator = this.#createAssetPropertyPaginator(
      { client },
      { assetId: assetId, filter: 'ALL' }
    );
    this.#signal = signal;
    this.#client = client;
    this.#describeAssetCommand = this.#createDescribeCommand(assetId);
  }

  public async send() {
    try {
      //get all assetProperties
      const assetPropertiesSummaryList = [];
      for await (const result of this.#listAssetPropertyPaginator) {
        if (this.#signal?.aborted) {
          break;
        }
        const assetPropertySummaries = result?.assetPropertySummaries ?? [];
        assetPropertiesSummaryList.push(...assetPropertySummaries);
      }

      //get assetModelId
      const { assetModelId } = await this.#client.send(
        this.#describeAssetCommand,
        {
          abortSignal: this.#signal,
        }
      );

      // get all AssetModelProperties for dataType
      const listAssetModelPropertiesPaginator =
        this.#createAssetModelPropertyPaginator(
          { client: this.#client },
          { assetModelId, filter: 'ALL' }
        );
      const assetModelPropertiesMap: {
        [x: string]: AssetModelPropertySummary;
      } = {};
      for await (const {
        assetModelPropertySummaries = [],
      } of listAssetModelPropertiesPaginator) {
        if (this.#signal?.aborted) {
          break;
        }
        assetModelPropertySummaries.forEach((modelSummary) => {
          if (modelSummary.id) {
            assetModelPropertiesMap[modelSummary.id] = modelSummary;
          }
        });
      }

      const allProperties = assetPropertiesSummaryList.map((assetSummary) => {
        const modelSummary = assetModelPropertiesMap[assetSummary.id ?? ''];
        return {
          ...modelSummary,
          ...assetSummary, // this goes second so the type property is overwritten correctly
        };
      });

      return compact(allProperties);
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createDescribeCommand(assetId: string): DescribeAssetCommand {
    return new DescribeAssetCommand({ assetId });
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
    console.table(this.#createAssetPropertyPaginator.arguments);

    throw error;
  }
}
