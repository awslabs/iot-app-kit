import React, { FC } from 'react';
import { useAssetDescriptionMapQuery } from '~/hooks/useAssetDescriptionQueries';
import type { StyledAssetQuery } from '~/customization/widgets/types';
import { isJust } from '~/util/maybe';
import { SelectOneWidget } from '../shared/selectOneWidget';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { StyledPropertyComponent } from './styledPropertyComponent';
import { Box } from '@cloudscape-design/components';
import { StyledPropertiesAlarmsSectionProps } from './sectionTypes';
import { defaultOnDeleteQuery } from './onDeleteProperty';

const NoComponents = () => <Box variant='p'>No properties or alarms found</Box>;

export const StyledPropertiesAlarmsSection: FC<StyledPropertiesAlarmsSectionProps> = ({
  queryConfig,
  updateQueryConfig,
  onDeleteAssetQuery = defaultOnDeleteQuery,
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
   * If either of these properties differ, it's not possible
   * to edit the selection in bulk. They will always be defined
   * if the selection only contains 1 widget
   */
  const mustEditAsSingle = !editablePropertiesAndAlarms;

  const styledAssetQuery = (editablePropertiesAndAlarms && queryConfig.value.query) || undefined;
  const describedAssetsMapQuery = useAssetDescriptionMapQuery(styledAssetQuery);
  const describedAssetsMap = describedAssetsMapQuery.data ?? {};

  const getComponents = () => {
    if (mustEditAsSingle) return <SelectOneWidget />;

    const updateSiteWiseAssetQuery = (newQuery: StyledAssetQuery) => {
      updateQueryConfig({
        ...queryConfig.value,
        query: newQuery,
      });
    };

    const onUpdatePropertyStyles = (updatedAssetId: string, updatedPropertyId: string, newStyles: object) => {
      const newQuery = {
        ...styledAssetQuery,
        assets:
          styledAssetQuery?.assets.map((asset) => {
            if (asset.assetId === updatedAssetId) {
              return {
                ...asset,
                properties: asset.properties.map((property) => {
                  if (property.propertyId === updatedPropertyId) {
                    return { ...property, ...newStyles };
                  } else {
                    return property;
                  }
                }),
              };
            } else {
              return asset;
            }
          }) ?? [],
      };

      updateSiteWiseAssetQuery(newQuery);
    };

    const onHideAssetQuery = (updatedAssetId: string, updatedPropertyId: string) => {
      const newQuery = {
        ...styledAssetQuery,
        assets:
          styledAssetQuery?.assets.map((asset) => {
            if (asset.assetId === updatedAssetId) {
              return {
                ...asset,
                properties: asset.properties.map((property) => {
                  if (property.propertyId === updatedPropertyId) {
                    const visible = property.visible !== undefined ? !property.visible : false;
                    return { ...property, visible };
                  } else {
                    return property;
                  }
                }),
              };
            } else {
              return asset;
            }
          }) ?? [],
      };

      updateSiteWiseAssetQuery(newQuery);
    };

    const components = styledAssetQuery?.assets.flatMap(({ assetId, properties }) =>
      properties.map((property) =>
        describedAssetsMap[assetId] ? (
          <StyledPropertyComponent
            key={`${assetId}-${property.propertyId}`}
            assetSummary={describedAssetsMap[assetId]}
            property={property}
            updateStyle={(newStyles: object) => onUpdatePropertyStyles(assetId, property.propertyId, newStyles)}
            onHideAssetQuery={() => onHideAssetQuery(assetId, property.propertyId)}
            onDeleteAssetQuery={onDeleteAssetQuery({
              assetId,
              propertyId: property.propertyId,
              siteWiseAssetQuery: styledAssetQuery,
              updateSiteWiseAssetQuery,
            })}
            colorable={colorable}
            isPropertyVisible={property.visible ?? true}
          />
        ) : null
      )
    );

    return components?.length ? components : <NoComponents />;
  };

  return (
    <SpaceBetween size='m' direction='vertical'>
      {getComponents()}
    </SpaceBetween>
  );
};
