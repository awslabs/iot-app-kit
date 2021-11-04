import { DATA_SOURCE_NAME } from '../../data-sources/site-wise/data-source';
import { SiteWiseDataStreamQuery } from '../../data-sources/site-wise/types.d';

const STRING_ASSET_ID = '9a9ca8e2-779d-443f-93a9-c287fd8f9c66';
const STRING_PROPERTY_ID = '9530e220-b353-4331-b4b3-cf0949c8684d';

export const STRING_QUERY = {
  source: 'site-wise',
  assets: [{ assetId: STRING_ASSET_ID, propertyIds: [STRING_PROPERTY_ID] }],
} as SiteWiseDataStreamQuery;

const NUMBER_ASSET_ID = '9a9ca8e2-779d-443f-93a9-c287fd8f9c66';
const NUMBER_PROPERTY_ID = '9530e220-b353-4331-b4b3-cf0949c8684d';

export const NUMBER_QUERY = {
  source: DATA_SOURCE_NAME,
  assets: [{ assetId: NUMBER_ASSET_ID, propertyIds: [NUMBER_PROPERTY_ID] }],
} as SiteWiseDataStreamQuery;
