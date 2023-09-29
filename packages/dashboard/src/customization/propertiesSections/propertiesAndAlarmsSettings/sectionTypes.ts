import type { StyledAssetQuery, StyledSiteWiseQueryConfig, SiteWiseQueryConfig } from '~/customization/widgets/types';
import { Maybe } from '~/util/maybe';
import type { StyleSettingsMap } from '@iot-app-kit/core';
import type { IoTSiteWiseDataStreamQuery } from '~/types';

export type OnDeleteAssetQuery = (params: {
  assetId: string;
  propertyId: string;
  siteWiseAssetQuery: IoTSiteWiseDataStreamQuery | StyledAssetQuery;
  updateSiteWiseAssetQuery: (newQuery: IoTSiteWiseDataStreamQuery) => void;
}) => () => void;

export type PropertiesAlarmsSectionProps = {
  queryConfig: Maybe<SiteWiseQueryConfig>;
  updateQueryConfig: (newValue: SiteWiseQueryConfig) => void;
  styleSettings: Maybe<StyleSettingsMap | undefined>;
  updateStyleSettings: (newValue: StyleSettingsMap | undefined) => void;
  onDeleteAssetQuery?: OnDeleteAssetQuery;
  colorable?: boolean;
};

export type StyledPropertiesAlarmsSectionProps = {
  queryConfig: Maybe<StyledSiteWiseQueryConfig>;
  updateQueryConfig: (newValue: StyledSiteWiseQueryConfig) => void;
  onDeleteAssetQuery?: OnDeleteAssetQuery;
  colorable?: boolean;
};
