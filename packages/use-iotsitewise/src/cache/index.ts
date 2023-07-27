import {
  type DescribeAssetCommandInput,
  type DescribeAssetModelCommandInput,
  type DescribeBulkImportJobCommandInput,
  type DescribeGatewayCommandInput,
  type ListAssetsCommandInput,
  type ListAssociatedAssetsCommandInput,
  type ListAssetModelsCommandInput,
  type ListBulkImportJobsCommandInput,
  type ListGatewaysCommandInput,
  type BatchGetAssetPropertyValueCommandInput,
  type BatchGetAssetPropertyAggregatesCommandInput,
  type BatchGetAssetPropertyValueHistoryCommandInput,
} from '@aws-sdk/client-iotsitewise';

export const iotSiteWiseKeys = {
  /** Reference to all IoT SiteWise resources within the application cache. */
  all: [{ service: 'IoT SiteWise' }] as const,

  /** Reference to all IoT SiteWise asset resources within the application cache.  */
  assets: () => [{ ...iotSiteWiseKeys.all[0], scope: 'assets' }] as const,
  /** Reference to all IoT SiteWise asset descriptions. */
  assetDescriptions: () => [{ ...iotSiteWiseKeys.assets()[0], resource: 'asset description' }] as const,
  /** Reference to a single IoT SiteWise asset description. */
  assetDescription: (input: DescribeAssetCommandInput) =>
    [{ ...iotSiteWiseKeys.assetDescriptions()[0], ...input }] as const,
  /** Reference to all IoT SiteWise asset summary lists. */
  assetSummaryLists: () => [{ ...iotSiteWiseKeys.assets()[0], resource: 'asset summary' }] as const,
  /** Reference to a single IoT SiteWise asset summary list. */
  assetSummaryList: (input: Omit<ListAssetsCommandInput, 'nextToken'>) =>
    [{ ...iotSiteWiseKeys.assetSummaryLists()[0], ...input }] as const,
  /** Reference to a single IoT SiteWise associated asset summary list. */
  assetSummaryAssociatedList: (input: Omit<ListAssociatedAssetsCommandInput, 'nextToken'>) =>
    [{ ...iotSiteWiseKeys.assetSummaryLists()[0], ...input }] as const,

  /** Reference to all IoT SiteWise asset model resources within the application cache.. */
  assetModels: () => [{ ...iotSiteWiseKeys.all[0], scope: 'asset models' }] as const,
  /** Reference to all IoT SiteWise asset model descriptions. */
  assetModelDescriptions: () => [{ ...iotSiteWiseKeys.assetModels()[0], resource: 'asset model description' }] as const,
  /** Reference to a single IoT SiteWise asset model description. */
  assetModelDescription: (input: DescribeAssetModelCommandInput) => [
    { ...iotSiteWiseKeys.assetModelDescriptions()[0], ...input },
  ],
  /** Reference to all IoT SiteWise asset model summary lists. */
  assetModelSummaryLists: () => [{ ...iotSiteWiseKeys.assetModels()[0], resource: 'asset model summary' }] as const,
  /** Reference to a single IoT SiteWise asset model summary list. */
  assetModelSummaryList: (input: Omit<ListAssetModelsCommandInput, 'nextToken'>) => [
    { ...iotSiteWiseKeys.assetModelSummaryLists()[0], ...input },
  ],

  bulkImportJobs: () => [{ ...iotSiteWiseKeys.all[0], scope: 'bulk import jobs' }] as const,
  bulkImportJobDescriptions: () =>
    [{ ...iotSiteWiseKeys.bulkImportJobs()[0], resource: 'bulk import job description' }] as const,
  bulkImportJobDescription: (input: DescribeBulkImportJobCommandInput) =>
    [{ ...iotSiteWiseKeys.bulkImportJobDescriptions()[0], ...input }] as const,
  bulkImportJobSummaryLists: () =>
    [{ ...iotSiteWiseKeys.bulkImportJobs()[0], resource: 'bulk import job summaries' }] as const,
  bulkImportJobSummaryList: (input: ListBulkImportJobsCommandInput) =>
    [{ ...iotSiteWiseKeys.bulkImportJobSummaryLists()[0], ...input }] as const,

  /** Reference to all IoT SiteWise gateway resources within the application cache. */
  gateways: () => [{ ...iotSiteWiseKeys.all[0], scope: 'gateways' }] as const,
  /** Reference to all IoT SiteWise gateway descriptions. */
  gatewayDescriptions: () => [{ ...iotSiteWiseKeys.gateways()[0], resource: 'gateway description' }] as const,
  /** Reference to a single IoT SiteWise gateway description. */
  gatewayDescription: (input: DescribeGatewayCommandInput) =>
    [{ ...iotSiteWiseKeys.gatewayDescriptions()[0], ...input }] as const,
  /** Reference to all IoT SiteWise gateway summary lists. */
  gatewaySummaryLists: () => [{ ...iotSiteWiseKeys.gateways()[0], resource: 'gateway summary' }] as const,
  /** Reference to a single IoT SiteWise gateway summary list. */
  gatewaySummaryList: (input: Omit<ListGatewaysCommandInput, 'nextToken'>) =>
    [{ ...iotSiteWiseKeys.gatewaySummaryLists()[0], ...input }] as const,

  assetPropertyValues: () => [{ ...iotSiteWiseKeys.all[0], scope: 'asset property values' }] as const,

  assetPropertyValueBatches: () => [{ ...iotSiteWiseKeys.all[0], resource: 'asset property value batch' }] as const,
  assetPropertyValueBatch: (input: Omit<BatchGetAssetPropertyValueCommandInput, 'nextToken'>) =>
    [
      {
        ...iotSiteWiseKeys.assetPropertyValueBatches()[0],
        ...input,
      },
    ] as const,

  assetPropertyValueHistoryBatches: () =>
    [{ ...iotSiteWiseKeys.all[0], resource: 'asset property value history batch' }] as const,
  assetPropertyValueHistoryBatch: (input: Omit<BatchGetAssetPropertyValueHistoryCommandInput, 'nextToken'>) =>
    [
      {
        ...iotSiteWiseKeys.assetPropertyValueHistoryBatches()[0],
        ...input,
      },
    ] as const,

  assetPropertyAggregatesBatches: () =>
    [{ ...iotSiteWiseKeys.all[0], resource: 'asset property aggregate batch' }] as const,
  assetPropertyAggregatesBatch: (input: Omit<BatchGetAssetPropertyAggregatesCommandInput, 'nextToken'>) =>
    [
      {
        ...iotSiteWiseKeys.assetPropertyAggregatesBatches()[0],
        ...input,
      },
    ] as const,
} as const;
