export interface AssetModelViewModel {
  arn: string;
  id: string;
  name: string;
  description: string;
  status: string;
  creationDate?: Date;
  lastUpdateDate?: Date;
}

export interface AssetViewModel {
  arn: string;
  assetModelId: string;
  assetModelName: string;
  id: string;
  name: string;
  description: string;
  status: string;
  creationDate?: Date;
  lastUpdateDate?: Date;
}

export interface AssetPropertyViewModel {
  id: string;
  name: string;
  dataType: string;
  dataTypeSpec: string;
  alias: string;
  unit: string;
}

export interface TimeSeriesViewModel {
  arn: string;
  id: string;
  alias: string;
  assetId: string;
  propertyId: string;
  dataType: string;
  dataTypeSpec: string;
  creationDate?: Date;
  lastUpdateDate?: Date;
}
