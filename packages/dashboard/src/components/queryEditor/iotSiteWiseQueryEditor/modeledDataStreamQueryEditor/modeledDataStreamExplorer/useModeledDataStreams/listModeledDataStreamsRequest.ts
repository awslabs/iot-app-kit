import {
  DescribeAssetCommand,
  type IoTSiteWiseClient,
  type DescribeAssetCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import type { ModeledDataStream } from '../types';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';
import { DEFAULT_STRING } from '~/components/queryEditor/contants';

export class ListModeledDataStreamsRequest {
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
      const {
        assetId = DEFAULT_STRING,
        assetName = DEFAULT_STRING,
        assetProperties = [],
        assetCompositeModels = [],
      } = await this.#client.send(this.#command, {
        abortSignal: this.#signal,
      });

      const modeledDataStreams = this.#formatDataStreams({
        assetId,
        assetName,
        assetProperties,
        assetCompositeModels,
      });

      return modeledDataStreams;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand(assetId: string) {
    const command = new DescribeAssetCommand({ assetId });

    return command;
  }

  #formatDataStreams({
    assetId,
    assetName,
    assetProperties,
    assetCompositeModels,
  }: {
    assetId: NonNullable<DescribeAssetCommandOutput['assetId']>;
    assetName: NonNullable<DescribeAssetCommandOutput['assetName']>;
    assetProperties: NonNullable<DescribeAssetCommandOutput['assetProperties']>;
    assetCompositeModels: NonNullable<
      DescribeAssetCommandOutput['assetCompositeModels']
    >;
  }): ModeledDataStream[] {
    // there may be multiple composite models with their own properties lists
    const compositeProperties = assetCompositeModels.flatMap(
      ({ properties }) => properties
    );
    const allProperties = [...assetProperties, ...compositeProperties];
    const nonNullableProperties = createNonNullableList(allProperties);

    // we add the assetId and assetName to provide consumers of the data with additional context
    const allPropertiesWithAssetDetail =
      nonNullableProperties.map<ModeledDataStream>(
        ({
          id: propertyId = DEFAULT_STRING,
          name = DEFAULT_STRING,
          unit = DEFAULT_STRING,
          dataType = undefined as NonNullable<undefined>,
          dataTypeSpec = DEFAULT_STRING,
        }) => ({
          assetId,
          assetName,
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
    console.table(this.#command.input);

    throw error;
  }
}
