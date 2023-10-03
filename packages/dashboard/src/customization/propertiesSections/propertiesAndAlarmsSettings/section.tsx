import React, { FC } from 'react';
import { useAssetDescriptionMapQuery } from '~/hooks/useAssetDescriptionQueries';
import { PropertyComponent } from './propertyComponent';
import { isJust } from '~/util/maybe';
import { SelectOneWidget } from '../shared/selectOneWidget';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { PropertiesAlarmsSectionProps } from './sectionTypes';
import { defaultOnDeleteQuery } from './onDeleteProperty';
import { IoTSiteWiseDataStreamQuery } from '~/types';

const NoComponents = () => <Box variant='p'>No properties or alarms found</Box>;

export const GeneralPropertiesAlarmsSection: FC<PropertiesAlarmsSectionProps> = ({
  onDeleteAssetQuery = defaultOnDeleteQuery,
  queryConfig,
  updateQueryConfig,
  styleSettings,
  updateStyleSettings,
  colorable = true,
}) => {
  /**
   * Handles the asset query of a widget.
   * This will most likely be None if the selection contains
   * more than one widget and some sort of query is defined.
   * This is because we use a guid for refid in the query
   * which allows us to assign a color to the stream
   */
  const editablePropertiesAndAlarms = isJust(queryConfig);
  /**
   * the color style settings for the query. maps to it
   * via refid
   */
  const editableStyleSettings = isJust(styleSettings);

  /**
   * If either of these properties differ, it's not possible
   * to edit the selection in bulk. They will always be defined
   * if the selection only contains 1 widget
   */
  const mustEditAsSingle = !editablePropertiesAndAlarms || !editableStyleSettings;

  const siteWiseAssetQuery = (editablePropertiesAndAlarms && queryConfig.value.query) || undefined;
  const describedAssetsMapQuery = useAssetDescriptionMapQuery(siteWiseAssetQuery);
  const describedAssetsMap = describedAssetsMapQuery.data ?? {};

  const getComponents = () => {
    if (mustEditAsSingle) return <SelectOneWidget />;

    const styleSettingsValue = styleSettings.value ?? {};

    const updateSiteWiseAssetQuery = (newQuery: IoTSiteWiseDataStreamQuery) => {
      updateQueryConfig({
        ...queryConfig.value,
        query: newQuery,
      });
    };

    const onUpdatePropertyColor = (refId: string) => (color: string) => {
      updateStyleSettings({
        ...styleSettingsValue,
        [refId]: {
          ...styleSettingsValue[refId],
          color,
        },
      });
    };

    const modeled =
      siteWiseAssetQuery?.assets?.flatMap(({ assetId, properties }) =>
        properties.map(({ propertyId, refId = propertyId }) =>
          describedAssetsMap[assetId] ? (
            <PropertyComponent
              key={`${assetId}-${propertyId}`}
              propertyId={propertyId}
              refId={refId}
              assetSummary={describedAssetsMap[assetId]}
              styleSettings={styleSettingsValue}
              onDeleteAssetQuery={onDeleteAssetQuery({
                siteWiseAssetQuery: siteWiseAssetQuery,
                assetId,
                propertyId,
                updateSiteWiseAssetQuery,
              })}
              onUpdatePropertyColor={onUpdatePropertyColor(refId)}
              colorable={colorable}
            />
          ) : null
        )
      ) ?? [];

    const unmodeled =
      siteWiseAssetQuery?.properties?.map(({ propertyAlias, refId = propertyAlias }) => (
        <PropertyComponent
          key={propertyAlias}
          propertyId={propertyAlias}
          refId={refId}
          assetSummary={{ assetId: '', assetName: '', properties: [], alarms: [] }}
          styleSettings={styleSettingsValue}
          onDeleteAssetQuery={onDeleteAssetQuery({
            siteWiseAssetQuery: siteWiseAssetQuery,
            assetId: '',
            propertyId: propertyAlias,
            updateSiteWiseAssetQuery,
          })}
          onUpdatePropertyColor={onUpdatePropertyColor(refId)}
          colorable={colorable}
        />
      )) ?? [];

    const components = [...modeled, ...unmodeled];

    return components.length ? components : <NoComponents />;
  };

  return (
    <SpaceBetween size='m' direction='vertical'>
      {getComponents()}
    </SpaceBetween>
  );
};
