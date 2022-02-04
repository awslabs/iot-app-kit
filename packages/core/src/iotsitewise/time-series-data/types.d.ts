import { CacheSettings } from '../../data-module/data-cache/types';
import { DataStreamQuery, SubscriptionUpdate } from '../../data-module/types';

/**
 * Learn more about AWS IoT SiteWise assets at https://docs.aws.amazon.com/iot-sitewise/latest/userguide/industrial-asset-models.html
 */

export type AssetPropertyId = string;

export type AssetId = string;

export type PropertyAlias = string;

// Reference which can be used to associate styles to the associated results from a query
export type RefId = string;

export type PropertyQuery = {
  propertyId: string;
  refId?: RefId;
  resolution?: string;
  cacheSettings?: CacheSettings;
};

export type AssetQuery = {
  assetId: AssetId;
  properties: PropertyQuery[];
};

type SiteWiseAssetDataStreamQuery = DataStreamQuery & {
  assets: AssetQuery[];
};

// TODO: Make the data stream query support property aliases for unmodeled data support
type SiteWisePropertyAliasDataStreamQuery = DataStreamQuery & {
  propertyAliases: {
    propertyAlias: PropertyAlias;
    refId: RefId;
  };
};

// Unused currently, this is what we want to work towards.
export type SiteWiseDataStreamQuery = SiteWiseAssetDataStreamQuery;

export type SubscriptionResponse<Query extends DataStreamQuery> = {
  /** Unsubscribe from the subscription. This will prevent any of the previously subscribed to data, from being requested by the data-module. */
  unsubscribe: () => void;

  /** Update the subscription. This will immediately evaluate if a new query must be requested */
  update: (subscriptionUpdate: SubscriptionUpdate<Query>) => void;
};
