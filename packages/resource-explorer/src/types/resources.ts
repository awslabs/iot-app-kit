import type {
  AssetModelSummary,
  AssetSummary,
  DescribeAssetResponse,
  TimeSeriesSummary,
} from "@aws-sdk/client-iotsitewise";

export type AssetModelResource = AssetModelSummary;

export type AssetResource = AssetSummary;

export type AssetPropertyResource = NonNullable<
  DescribeAssetResponse["assetProperties"]
>[0];

export type TimeSeriesResource = TimeSeriesSummary;
