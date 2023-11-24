import {
  IoTSiteWiseClient,
  ListAssetPropertiesCommand,
  ListAssetModelPropertiesCommand,
  DescribeAssetCommandOutput,
  AssetProperty,
  AssetModelPropertySummary,
  ListAssetPropertiesCommandOutput,
  ListAssetModelPropertiesCommandOutput,
} from '@aws-sdk/client-iotsitewise';

export type ModeledDataStream = {
  assetId: NonNullable<DescribeAssetCommandOutput['assetId']>;
  assetName: NonNullable<DescribeAssetCommandOutput['assetName']>;
  propertyId: NonNullable<AssetProperty['id']>;
  name: NonNullable<AssetProperty['name']>;
  unit: NonNullable<AssetProperty['unit']>;
  dataType: NonNullable<AssetProperty['dataType']>;
  dataTypeSpec: NonNullable<AssetProperty['dataTypeSpec']>;
};

export type SelectedAsset = {
  assetId: string;
  assetModelId: string;
};

const DEFAULT_STRING = '-';

export function createNonNullableList<T extends U | undefined, U>(list: T[]): NonNullable<T>[] {
  return list.filter<NonNullable<T>>((item): item is NonNullable<typeof item> => item != null);
}

export class ListAssetModelPropertiesWithCompositeModels {
  // #signal: AbortSignal | undefined;
  #client: IoTSiteWiseClient;
  #assetId: string;
  #assetModelId: string;

  constructor({
    selectedAsset,
    client,
  }: // signal,
  {
    selectedAsset: SelectedAsset;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#client = client;
    this.#assetId = selectedAsset.assetId;
    this.#assetModelId = selectedAsset.assetModelId;
    // this.#signal = signal;
  }

  public async send() {
    let nextToken: ListAssetPropertiesCommandOutput['nextToken'] = undefined;
    const assetProperties: ListAssetPropertiesCommandOutput['assetPropertySummaries'] = [];
    try {
      //get all assetProperties
      do {
        const response: ListAssetPropertiesCommandOutput = await this.#client.send(
          new ListAssetPropertiesCommand({ assetId: this.#assetId, filter: 'ALL', nextToken: nextToken })
        );
        nextToken = response.nextToken;
        assetProperties.push(...(response.assetPropertySummaries ?? []));
      } while (nextToken != undefined);

      const assetModelPropertiesMap: { [x: string]: AssetModelPropertySummary } = {};
      nextToken = undefined;
      do {
        const response: ListAssetModelPropertiesCommandOutput = await this.#client.send(
          new ListAssetModelPropertiesCommand({ assetModelId: this.#assetModelId, filter: 'ALL', nextToken: nextToken })
        );
        response.assetModelPropertySummaries?.forEach((modelSummary) => {
          if (modelSummary.id) {
            assetModelPropertiesMap[modelSummary.id] = modelSummary;
          }
        });
        nextToken = response.nextToken;
      } while (nextToken != undefined);

      const modeledDataStreams = this.#formatDataStreams({ assetProperties, assetModelPropertiesMap });
      return modeledDataStreams;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #formatDataStreams({
    assetProperties,
    assetModelPropertiesMap,
  }: {
    assetProperties: NonNullable<ListAssetPropertiesCommandOutput['assetPropertySummaries']>;
    assetModelPropertiesMap: { [x: string]: AssetModelPropertySummary };
  }): ModeledDataStream[] {
    const allProperties = assetProperties.map((assetSummary) => {
      const modelSummary = assetModelPropertiesMap[assetSummary.id ?? ''];
      return {
        ...modelSummary,
        ...assetSummary, // this goes second so the type property is overwritten correctly
      };
    });
    const nonNullableProperties = createNonNullableList(allProperties);

    const allPropertiesWithAssetDetail = nonNullableProperties.map(
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
    console.table(this.#assetId);

    throw error;
  }
}
