import {
  batchGetAssetPropertyValueHandler,
  batchGetAssetPropertyValueHistoryHandler,
  batchGetAssetPropertyAggregatesHandler,
} from './iot-sitewise/handlers/batchGetAssetPropertyValue/batchGetAssetPropertyValueHandler';
import { describeAssetHandler } from './iot-sitewise/handlers/describeAsset/describeAssetHandler';
import { describeAssetModelHandler } from './iot-sitewise/handlers/describeAssetModel/describeAssetModelHandler';
import { listAssetsHandler } from './iot-sitewise/handlers/listAssets/listAssetsHandler';
import { listAssociatedAssetsHandler } from './iot-sitewise/handlers/listAssociatedAssets/listAssociatedAssetsHandler';
import { listAssetModelsHandler } from './iot-sitewise/handlers/listAssetModels/listAssetModels';
import { listAssetModelPropertiesHandler } from './iot-sitewise/handlers/listAssetModelProperties/listAssetModelProperties';
import { listAssetPropertiesHandler } from './iot-sitewise/handlers/listAssetProperties/listAssetProperties';

export const handlers = [
  batchGetAssetPropertyAggregatesHandler(),
  batchGetAssetPropertyValueHandler(),
  batchGetAssetPropertyValueHistoryHandler(),
  describeAssetHandler(),
  describeAssetModelHandler(),
  listAssetsHandler(),
  listAssetModelsHandler(),
  listAssociatedAssetsHandler(),
  listAssetModelPropertiesHandler(),
  listAssetPropertiesHandler(),
];
