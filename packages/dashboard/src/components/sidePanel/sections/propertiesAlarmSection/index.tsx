import React, { FC } from 'react';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { ExpandableSection, SpaceBetween } from '@cloudscape-design/components';

import { DashboardMessages } from '~/messages';
import { QueryWidget } from '~/customization/widgets/types';
import { useAssetDescriptionMapAsync } from '~/hooks/useAssetDescriptionMapAsync';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { PropertyComponent } from './propertyComponent';
import { useWidgetLense } from '../../utils/useWidgetLense';
import { StyleSettingsMap } from '@iot-app-kit/core';
import { Widget } from '~/types';

export const isPropertiesAndAlarmsSupported = (widget: Widget): boolean =>
  ['iot-line', 'iot-scatter', 'iot-bar', 'iot-table', 'iot-kpi', 'iot-status'].some((t) => t === widget.type);

export type PropertiesAlarmsSectionProps = {
  messageOverrides: DashboardMessages;
};
const PropertiesAlarmsSection: FC<QueryWidget> = (widget) => {
  const [siteWiseAssetQuery, updateSiteWiseAssetQuery] = useWidgetLense<QueryWidget, SiteWiseAssetQuery | undefined>(
    widget,
    (w) => w.properties.queryConfig.query,
    (w, query) => ({
      ...w,
      properties: {
        ...w.properties,
        queryConfig: {
          ...w.properties.queryConfig,
          query,
        },
      },
    })
  );

  const [styleSettings = {}, updateStyleSettings] = useWidgetLense<QueryWidget, StyleSettingsMap | undefined>(
    widget,
    (w) => w.properties.styleSettings,
    (w, styleSettings) => ({
      ...w,
      properties: {
        ...w.properties,
        styleSettings,
      },
    })
  );

  const describedAssetsMap = useAssetDescriptionMapAsync(siteWiseAssetQuery);

  const onDeleteAssetQuery = (assetId: string, propertyId: string) => () => {
    const assets =
      siteWiseAssetQuery?.assets
        .map((asset) => {
          if (assetId === asset.assetId) {
            const { properties } = asset;
            return {
              assetId,
              properties: properties.filter((p) => p.propertyId !== propertyId),
            };
          }
          return asset;
        })
        .filter((asset) => asset.properties.length > 0) ?? [];

    updateSiteWiseAssetQuery({ assets });
  };

  const onUpdatePropertyColor = (refId: string) => (color: string) => {
    updateStyleSettings({
      ...styleSettings,
      [refId]: {
        ...styleSettings[refId],
        color,
      },
    });
  };

  const components = siteWiseAssetQuery?.assets.flatMap(({ assetId, properties }) =>
    properties.map(({ propertyId, refId = propertyId }) => (
      <PropertyComponent
        key={`${assetId}-${propertyId}`}
        propertyId={propertyId}
        refId={refId}
        assetDescription={describedAssetsMap[assetId]}
        styleSettings={styleSettings}
        onDeleteAssetQuery={onDeleteAssetQuery(assetId, propertyId)}
        onUpdatePropertyColor={onUpdatePropertyColor(refId)}
      />
    ))
  );

  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader>Properties & Alarms</ExpandableSectionHeader>}
      defaultExpanded
    >
      <SpaceBetween size='s' direction='vertical'>
        {components}
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default PropertiesAlarmsSection;
