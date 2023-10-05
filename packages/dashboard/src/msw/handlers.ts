import {
  batchGetAssetPropertyValueHandler,
  batchGetAssetPropertyValueHistoryHandler,
  batchGetAssetPropertyAggregatesHandler,
} from './iot-sitewise/handlers/batchGetAssetPropertyValue/batchGetAssetPropertyValueHandler';
import { describeAssetHandler } from './iot-sitewise/handlers/describeAsset/describeAssetHandler';
import { describeAssetModelHandler } from './iot-sitewise/handlers/describeAssetModel/describeAssetModelHandler';
import { listAssetsHandler } from './iot-sitewise/handlers/listAssets/listAssetsHandler';
import { listAssociatedAssetsHandler } from './iot-sitewise/handlers/listAssociatedAssets/listAssociatedAssetsHandler';

export const handlers = [
  batchGetAssetPropertyAggregatesHandler(),
  batchGetAssetPropertyValueHandler(),
  batchGetAssetPropertyValueHistoryHandler(),
  describeAssetHandler(),
  describeAssetModelHandler(),
  listAssetsHandler(),
  listAssociatedAssetsHandler(),
];
