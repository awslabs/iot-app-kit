import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { StyleSettingsMap } from '@iot-app-kit/core';
import type {
  SiteWiseQueryConfig,
  StyledAssetQuery,
  StyledSiteWiseQueryConfig,
} from '../../../customization/widgets/types';
import type { IoTSiteWiseDataStreamQuery } from '../../../types';
import { type Maybe } from '../../../util/maybe';

export type OnDeleteAssetQuery = (params: {
  assetId: string;
  propertyId: string;
  siteWiseAssetQuery: IoTSiteWiseDataStreamQuery | StyledAssetQuery;
  updateSiteWiseAssetQuery: (newQuery: StyledAssetQuery) => void;
}) => () => void;

export type PropertiesAlarmsSectionProps = {
  queryConfig: Maybe<SiteWiseQueryConfig>;
  updateQueryConfig: (newValue: SiteWiseQueryConfig) => void;
  styleSettings: Maybe<StyleSettingsMap | undefined>;
  updateStyleSettings: (newValue: StyleSettingsMap | undefined) => void;
  onDeleteAssetQuery?: OnDeleteAssetQuery;
  colorable?: boolean;
  client: IoTSiteWiseClient;
};

export type StyledPropertiesAlarmsSectionProps = {
  queryConfig: Maybe<StyledSiteWiseQueryConfig>;
  updateQueryConfig: (newValue: StyledSiteWiseQueryConfig) => void;
  onDeleteAssetQuery?: OnDeleteAssetQuery;
  colorable?: boolean;
  client: IoTSiteWiseClient;
};
