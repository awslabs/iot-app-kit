import type { FC } from 'react';
import React from 'react';
import { ExpandableSection, SpaceBetween } from '@cloudscape-design/components';
import { useAssetDescriptionMapAsync } from '~/hooks/useAssetDescriptionMapAsync';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { PropertyComponent } from './propertyComponent';
import { useWidgetLense } from '../../utils/useWidgetLense';
import { mapAssetDescriptionToAssetSummary } from '~/components/resourceExplorer/components/mapper';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { toId } from '@iot-app-kit/source-iotsitewise';
import type { QueryWidget, TableProperties } from '~/customization/widgets/types';
import type { StyleSettingsMap } from '@iot-app-kit/core';
import type { Widget } from '~/types';
import type { TableItemRef } from '@iot-app-kit/react-components';
import { TableItem } from '@iot-app-kit/react-components';

function isTableItemRef(value: TableItem[string]): value is TableItemRef {
  return typeof value === 'object' && value?.$cellRef !== undefined;
}

export type PropertiesAlarmsSectionProps = QueryWidget & {
  onDeleteAssetQuery?: (params: {
    assetId: string;
    propertyId: string;
    siteWiseAssetQuery: SiteWiseAssetQuery;
    updateSiteWiseAssetQuery: (newQuery: SiteWiseAssetQuery) => void;
  }) => () => void;
};

const defaultOnDeleteQuery: PropertiesAlarmsSectionProps['onDeleteAssetQuery'] =
  ({ assetId, propertyId, siteWiseAssetQuery, updateSiteWiseAssetQuery }) =>
  () => {
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
export const isPropertiesAndAlarmsSupported = (widget: Widget): widget is QueryWidget =>
  ['line-chart', 'scatter-chart', 'bar-chart', 'table', 'kpi', 'status'].some((t) => t === widget.type);

const GeneralPropertiesAlarmsSection: FC<PropertiesAlarmsSectionProps> = ({
  onDeleteAssetQuery = defaultOnDeleteQuery,
  ...widget
}) => {
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
    properties.map(({ propertyId, refId = propertyId }) =>
      describedAssetsMap[assetId] ? (
        <PropertyComponent
          key={`${assetId}-${propertyId}`}
          propertyId={propertyId}
          refId={refId}
          assetSummary={mapAssetDescriptionToAssetSummary(describedAssetsMap[assetId])}
          styleSettings={styleSettings}
          onDeleteAssetQuery={onDeleteAssetQuery({ assetId, propertyId, siteWiseAssetQuery, updateSiteWiseAssetQuery })}
          onUpdatePropertyColor={onUpdatePropertyColor(refId)}
        />
      ) : null
    )
  );

  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader>Properties & Alarms</ExpandableSectionHeader>}
      defaultExpanded
    >
      <SpaceBetween size='m' direction='vertical'>
        {components}
      </SpaceBetween>
    </ExpandableSection>
  );
};
export const TablePropertiesAlarmsSection: FC<QueryWidget> = (widget) => {
  const [properties, updateTableProperties] = useWidgetLense<QueryWidget, TableProperties>(
    widget,
    (w) => w.properties,
    (w, properties) => ({
      ...w,
      properties,
    })
  );

  const deleteQuery: PropertiesAlarmsSectionProps['onDeleteAssetQuery'] =
    ({ assetId, propertyId, siteWiseAssetQuery }) =>
    () => {
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

      const newItems = properties.items?.filter((item) => {
        const value = item.value;
        return isTableItemRef(value) && value.$cellRef.id !== toId({ assetId, propertyId });
      });
      updateTableProperties({
        ...properties,
        queryConfig: {
          ...properties.queryConfig,
          query: {
            assets,
          },
        },
        items: newItems || [],
      });
    };

  return <GeneralPropertiesAlarmsSection {...widget} onDeleteAssetQuery={deleteQuery} />;
};

export const PropertiesAlarmsSection: React.FC<PropertiesAlarmsSectionProps> = (props) => {
  const isTableWidget = props.type === 'table';
  return isTableWidget ? <TablePropertiesAlarmsSection {...props} /> : <GeneralPropertiesAlarmsSection {...props} />;
};
export default PropertiesAlarmsSection;
