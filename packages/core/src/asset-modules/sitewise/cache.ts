import {
  AssetPropertyValue,
  AssetSummary,
  DescribeAssetResponse,
  DescribeAssetModelResponse
} from '@aws-sdk/client-iotsitewise';

export class SiteWiseAssetCache {
  private assetCache: Record<string, AssetSummary> = {};
  private assetModelCache: Record<string, DescribeAssetModelResponse> = {};
  private propertyValueCache: Record<string, AssetPropertyValue> = {};

  private convertToAssetSummary(assetDescription: DescribeAssetResponse): AssetSummary {
    return {
      id: assetDescription.assetId,
      arn: assetDescription.assetArn,
      name: assetDescription.assetName,
      assetModelId: assetDescription.assetModelId,
      creationDate: assetDescription.assetCreationDate,
      lastUpdateDate: assetDescription.assetLastUpdateDate,
      status: assetDescription.assetStatus,
      hierarchies: assetDescription.assetHierarchies,
    }
  }

  private assetPropertyValueKey(assetId: string, propertyId: string) : string {
    return assetId + ':' + propertyId;
  }

  public getAssetSummary(assetId: string): AssetSummary | undefined {
    return this.assetCache[assetId];
  }

  public storeAssetSummary(assetSummary: AssetSummary): void;
  public storeAssetSummary<Type extends DescribeAssetResponse>(assetDescription: Type): void;
  public storeAssetSummary(assetAny: any): void {
    let assetSummary: AssetSummary;

    if ('assetId' in assetAny) {
      assetSummary = this.convertToAssetSummary(assetAny);
    } else {
      assetSummary = assetAny;
    }

    if (assetSummary.id !== undefined) {
      this.assetCache[assetSummary.id] = assetSummary;
    }
  }

  public getAssetModel(assetModelId: string): DescribeAssetModelResponse | undefined {
    return this.assetModelCache[assetModelId];
  }

  public storeAssetModel(assetModel: DescribeAssetModelResponse) {
    if (assetModel.assetModelId !== undefined) {
      this.assetModelCache[assetModel.assetModelId] = assetModel;
    }
  }

  public getPropertyValue(assetId: string, propertyId: string): AssetPropertyValue | undefined {
    return this.propertyValueCache[this.assetPropertyValueKey(assetId, propertyId)];
  }

  public storePropertyValue(assetId: string, propertyId: string, assetPropertyValue: AssetPropertyValue) {
    this.propertyValueCache[this.assetPropertyValueKey(assetId, propertyId)] = assetPropertyValue;
  }
}
