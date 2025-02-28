import type { DropDownResourceDefinition } from '../types/drop-down';
import type {
  AlarmResource,
  AssetModelResource,
  AssetPropertyResource,
  AssetResource,
  TimeSeriesResource,
} from '../types/resources';

export const DEFAULT_ASSET_MODEL_DROP_DOWN_DEFINITION: DropDownResourceDefinition<AssetModelResource> =
  {
    selectResourceId: ({ assetModelId }) => assetModelId,
    renderResourceName: ({ name }) => name,
    renderResourceDescription: ({ description = '' }) => description,
  };

export const DEFAULT_ASSET_DROP_DOWN_DEFINITION: DropDownResourceDefinition<AssetResource> =
  {
    selectResourceId: ({ assetId }) => assetId,
    renderResourceName: ({ name }) => name,
    renderResourceDescription: ({ description = '' }) => description,
  };

export const DEFAULT_ASSET_PROPERTY_DROP_DOWN_DEFINITION: DropDownResourceDefinition<AssetPropertyResource> =
  {
    selectResourceId: ({ propertyId }) => propertyId,
    renderResourceName: ({ name }) => name,
  };

export const DEFAULT_ALARM_DROP_DOWN_DEFINITION: DropDownResourceDefinition<AlarmResource> =
  {
    selectResourceId: ({ assetCompositeModelId }) => assetCompositeModelId,
    renderResourceName: ({ name }) => name,
  };

export const DEFAULT_TIME_SERIES_DROP_DOWN_DEFINITION: DropDownResourceDefinition<TimeSeriesResource> =
  {
    selectResourceId: ({ timeSeriesId }) => timeSeriesId,
    renderResourceName: ({ alias, timeSeriesId }) => alias ?? timeSeriesId,
  };
