import { BatchGetAssetPropertyAggregatesCommandInput } from '@aws-sdk/client-iotsitewise';

interface AssetQueryPart {
  assetId: string;
  properties: {
    propertyId: string;
    aggregateTypes?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['aggregateTypes'];
    resolution?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['resolution'];
  }[];
}

interface PropertyQueryPart {
  propertyAlias: string;
  aggregateTypes?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['aggregateTypes'];
  resolution?: NonNullable<BatchGetAssetPropertyAggregatesCommandInput['entries']>[number]['resolution'];
}

export interface TimeSeriesQuery {
  queryId: string;
  assets?: AssetQueryPart[];
  properties?: PropertyQueryPart[];
}

export type TimeSeriesQueryEntry = {
  queryId: string;
  entryId: string;
  assetId?: AssetQueryPart['assetId'];
  propertyId?: AssetQueryPart['properties'][number]['propertyId'];
  propertyAlias?: PropertyQueryPart['propertyAlias'];
  aggregateTypes?: PropertyQueryPart['aggregateTypes'];
  resolution?: PropertyQueryPart['resolution'];
};

// QueryID is not unique
// EntryID is unique

// QueryID : EntryID is a one-to-many relationship
