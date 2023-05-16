import type {
  AssetModelResource,
  AssetPropertyResource,
  AssetResource,
  TimeSeriesResource,
} from "../types/resources";
import type {
  AssetModelViewModel,
  AssetPropertyViewModel,
  AssetViewModel,
  TimeSeriesViewModel,
} from "../types/view-models";

export function createAssetModelViewModel(
  assetModel: AssetModelResource
): AssetModelViewModel {
  return {
    arn: assetModel.arn ?? "-",
    id: assetModel.id ?? "-",
    name: assetModel.name ?? "-",
    description: assetModel.description ?? "-",
    status: assetModel.status?.state ?? "-",
    creationDate: assetModel.creationDate,
    lastUpdateDate: assetModel.lastUpdateDate,
  };
}

export function createAssetViewModel(assetModels: AssetModelViewModel[]) {
  return (asset: AssetResource): AssetViewModel => {
    return {
      arn: asset.arn ?? "-",
      assetModelId: asset.assetModelId ?? "-",
      assetModelName:
        assetModels.find((assetModel) => assetModel.id === asset.assetModelId)
          ?.name ?? "-",
      id: asset.id ?? "-",
      name: asset.name ?? "-",
      description: asset.description ?? "-",
      status: asset.status?.state ?? "-",
      creationDate: asset.creationDate,
      lastUpdateDate: asset.lastUpdateDate,
    };
  };
}

export function createAssetPropertyViewModel(
  resource: AssetPropertyResource
): AssetPropertyViewModel {
  return {
    id: resource.id ?? "-",
    name: resource.name ?? "-",
    dataType: resource.dataType ?? "-",
    dataTypeSpec: resource.dataTypeSpec ?? "-",
    alias: resource.alias ?? "-",
    unit: resource.unit ?? "-",
  };
}

export function createTimeSeriesViewModel(
  resource: TimeSeriesResource
): TimeSeriesViewModel {
  return {
    arn: resource.timeSeriesArn ?? "-",
    id: resource.timeSeriesId ?? "-",
    alias: resource.alias ?? "-",
    assetId: resource.assetId ?? "-",
    propertyId: resource.propertyId ?? "-",
    dataType: resource.dataType ?? "-",
    dataTypeSpec: resource.dataTypeSpec ?? "-",
    creationDate: resource.timeSeriesCreationDate,
    lastUpdateDate: resource.timeSeriesLastUpdateDate,
  };
}
