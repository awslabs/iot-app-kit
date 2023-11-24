import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';

import type { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';

type AssetId = string;
type AssetName = string;
type PropertyId = string;
type PropertyName = string;
type Model = [AssetId, AssetName, PropertyId, PropertyName];

const MODEL_MAP = {
  assetId: 0,
  assetName: 1,
  propertyId: 2,
  propertyName: 3,
};

export class QueryResponseProcessor {
  public static process(response: ExecuteQueryCommandOutput): ModeledDataStream[] {
    const modeledDataStreams = this.#convertResponseToModeledDataStreams(response.rows ?? []);

    return modeledDataStreams;
  }

  static #convertResponseToModeledDataStreams(
    rows: NonNullable<ExecuteQueryCommandOutput['rows']>
  ): ModeledDataStream[] {
    const modeledDataStreams = rows.map((row) => {
      const rowAsModel: Model = row.rowData as unknown as Model;

      const modeledDataStream = this.#convertRowToModeledDataStream(rowAsModel);

      return modeledDataStream;
    });

    return modeledDataStreams;
  }

  static #convertRowToModeledDataStream(rowData: Model): ModeledDataStream {
    const modeledDataStream = {
      assetId: rowData[MODEL_MAP.assetId],
      assetName: rowData[MODEL_MAP.assetName],
      propertyId: rowData[MODEL_MAP.propertyId],
      name: rowData[MODEL_MAP.propertyName],
      unit: '',
      dataType: undefined as NonNullable<undefined>,
      dataTypeSpec: '',
    };

    return modeledDataStream;
  }
}
