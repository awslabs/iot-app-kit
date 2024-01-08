import { LoadingStateEnum } from './types';
import type {
  AssetPropertyValue,
  AssetSummary,
  AssociatedAssetsSummary,
  DescribeAssetModelResponse,
  DescribeAssetResponse,
} from '@aws-sdk/client-iotsitewise';
import type { CachedAssetSummaryBlock } from './types';
import type { ErrorDetails } from '@iot-app-kit/core';

export class SiteWiseAssetCache {
  private assetCache: Record<string, AssetSummary> = {};
  private assetModelCache: Record<string, DescribeAssetModelResponse> = {};
  private propertyValueCache: Record<string, AssetPropertyValue> = {};
  private hierarchyCache: Record<string, CachedAssetSummaryBlock> = {};
  private errorCache: ErrorDetails[] = [];

  public storeErrors(err: ErrorDetails): void {
    this.errorCache.push(err);
  }

  public getAllErrors(): ErrorDetails[] {
    return this.errorCache;
  }

  private convertToAssetSummary(
    assetDescription: DescribeAssetResponse
  ): AssetSummary {
    return {
      id: assetDescription.assetId,
      arn: assetDescription.assetArn,
      name: assetDescription.assetName,
      assetModelId: assetDescription.assetModelId,
      creationDate: assetDescription.assetCreationDate,
      lastUpdateDate: assetDescription.assetLastUpdateDate,
      status: assetDescription.assetStatus,
      hierarchies: assetDescription.assetHierarchies,
    };
  }

  private readonly isDescribeAssetResponse = (
    assetAny: AssetSummary | DescribeAssetResponse
  ): assetAny is DescribeAssetResponse =>
    (assetAny as DescribeAssetResponse).assetId != undefined;

  private assetPropertyValueKey(assetId: string, propertyId: string): string {
    return assetId + ':' + propertyId;
  }

  public getAssetSummary(assetId: string): AssetSummary | undefined {
    return this.assetCache[assetId];
  }

  public storeAssetSummary(
    assetAny: AssetSummary | DescribeAssetResponse
  ): void {
    const assetSummary: AssetSummary = this.isDescribeAssetResponse(assetAny)
      ? this.convertToAssetSummary(assetAny)
      : assetAny;
    if (assetSummary.id != undefined) {
      this.assetCache[assetSummary.id] = assetSummary;
    }
  }

  public storeAssetSummaries(
    assetSummaryList: DescribeAssetResponse[] | AssociatedAssetsSummary[]
  ): void {
    assetSummaryList.forEach((summary) => {
      this.storeAssetSummary(summary as AssetSummary);
    });
  }

  public getAssetModel(
    assetModelId: string
  ): DescribeAssetModelResponse | undefined {
    return this.assetModelCache[assetModelId];
  }

  public storeAssetModel(assetModel: DescribeAssetModelResponse) {
    if (assetModel.assetModelId != undefined) {
      this.assetModelCache[assetModel.assetModelId] = assetModel;
    }
  }

  public getPropertyValue(
    assetId: string,
    propertyId: string
  ): AssetPropertyValue | undefined {
    return this.propertyValueCache[
      this.assetPropertyValueKey(assetId, propertyId)
    ];
  }

  public storePropertyValue(
    assetId: string,
    propertyId: string,
    assetPropertyValue: AssetPropertyValue
  ) {
    this.propertyValueCache[this.assetPropertyValueKey(assetId, propertyId)] =
      assetPropertyValue;
  }

  public getHierarchy(
    hierarchyId: string
  ): CachedAssetSummaryBlock | undefined {
    return this.hierarchyCache[hierarchyId];
  }

  private newCachedAssetSummaryBlock(): CachedAssetSummaryBlock {
    return {
      assetIds: [],
      loadingStage: LoadingStateEnum.NOT_LOADED,
      paginationToken: undefined,
    };
  }

  private setupHierarchyCache(hierarchyId: string): CachedAssetSummaryBlock {
    let storedHierarchy: CachedAssetSummaryBlock | undefined =
      this.getHierarchy(hierarchyId);
    if (!storedHierarchy) {
      storedHierarchy = this.newCachedAssetSummaryBlock();
      this.hierarchyCache[hierarchyId] = storedHierarchy;
    }
    return storedHierarchy;
  }

  public appendHierarchyResults(
    hierarchyId: string,
    assetSummaries: AssetSummary[] | AssociatedAssetsSummary[] | undefined,
    loadingState: LoadingStateEnum,
    paginationToken: string | undefined
  ) {
    const storedHierarchy: CachedAssetSummaryBlock =
      this.setupHierarchyCache(hierarchyId);

    storedHierarchy.loadingStage = loadingState;
    storedHierarchy.paginationToken = paginationToken;
    if (!assetSummaries) {
      return;
    }
    assetSummaries.forEach((assetSummary) => {
      if (assetSummary.id != undefined) {
        this.storeAssetSummary(assetSummary);
        storedHierarchy.assetIds.push(assetSummary.id);
      }
    });
  }

  public setHierarchyLoadingState(
    hierarchyId: string,
    loadingState: LoadingStateEnum
  ) {
    const storedHierarchy: CachedAssetSummaryBlock =
      this.setupHierarchyCache(hierarchyId);
    storedHierarchy.loadingStage = loadingState;
  }
}
