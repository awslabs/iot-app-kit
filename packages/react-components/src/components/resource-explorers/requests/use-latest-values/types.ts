import type {
  AssetPropertyResource,
  TimeSeriesResource,
} from '../../types/resources';

export type DataStreamResource = AssetPropertyResource | TimeSeriesResource;

export interface DataStreamRequestEntry<DataStream extends DataStreamResource> {
  entryId: string;
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  dataStream: DataStream;
}

export type CreateEntryId<DataStream extends DataStreamResource> = (
  dataStream: DataStream
) => string;
