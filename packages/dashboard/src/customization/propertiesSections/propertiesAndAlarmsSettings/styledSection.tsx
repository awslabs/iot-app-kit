import React, { FC } from 'react';
import { useAssetDescriptionMapQuery } from '~/hooks/useAssetDescriptionQueries';
import { isJust } from '~/util/maybe';
import { SelectOneWidget } from '../shared/selectOneWidget';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { StyledPropertyComponent } from './styledPropertyComponent';
import { Box } from '@cloudscape-design/components';
import { StyledPropertiesAlarmsSectionProps } from './sectionTypes';
import { defaultOnDeleteQuery } from './onDeleteProperty';
import { StyledAssetQuery } from '~/customization/widgets/types';

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
          styledAssetQuery?.assets?.map((asset) => {
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
        properties:
          styledAssetQuery?.properties?.map((property) => {
            if (property.propertyAlias === updatedPropertyId) {
              return { ...property, ...newStyles };
            } else {
              return property;
            }
          }) ?? [],
      };

      updateSiteWiseAssetQuery(newQuery);
    };
    const onHideAssetQuery = (updatedAssetId: string, updatedPropertyId: string) => {
      const newQuery = {
        ...styledAssetQuery,
        assets:
          styledAssetQuery?.assets?.map((asset) => {
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

    const onHidePropertyAliasQuery = (propertyAlias: string) => {
      const newQuery = {
        ...styledAssetQuery,
        assets: styledAssetQuery?.assets || [],
        properties:
          (styledAssetQuery &&
            styledAssetQuery?.properties?.map((property) => {
              if (property.propertyAlias === propertyAlias) {
                const visible = property.visible !== undefined ? !property.visible : false;
                return visible ? property : { ...property, visible: false };
              } else {
                return property;
              }
            })) ??
          [],
      };

      updateSiteWiseAssetQuery(newQuery);
    };

    const modeled =
      styledAssetQuery?.assets?.flatMap(({ assetId, properties }) =>
        properties.map((property) =>
          describedAssetsMap[assetId] ? (
            <StyledPropertyComponent
              key={`${assetId}-${property.propertyId}`}
              assetSummary={describedAssetsMap[assetId]}
              property={property}
              updateStyle={(newStyles: object) => onUpdatePropertyStyles(assetId, property.propertyId, newStyles)}
              onDeleteAssetQuery={onDeleteAssetQuery({
                assetId,
                propertyId: property.propertyId,
                siteWiseAssetQuery: styledAssetQuery,
                updateSiteWiseAssetQuery,
              })}
              colorable={colorable}
              onHideAssetQuery={() => onHideAssetQuery(assetId, property.propertyId)}
              isPropertyVisible={property.visible ?? true}
            />
          ) : null
        )
      ) ?? [];

    const unmodeled =
      styledAssetQuery?.properties?.map((property) => {
        return (
          <StyledPropertyComponent
            key={property.propertyAlias}
            assetSummary={{ assetId: '', assetName: '', properties: [], alarms: [] }}
            property={{ ...property, propertyId: property.propertyAlias }}
            updateStyle={(newStyles: object) => onUpdatePropertyStyles('', property.propertyAlias, newStyles)}
            onDeleteAssetQuery={onDeleteAssetQuery({
              assetId: '',
              propertyId: property.propertyAlias,
              siteWiseAssetQuery: styledAssetQuery,
              updateSiteWiseAssetQuery,
            })}
            colorable={colorable}
            onHideAssetQuery={() => {
              onHidePropertyAliasQuery(property.propertyAlias);
            }}
            isPropertyVisible={property.visible ?? true}
          />
        );
      }) ?? [];

    const components = [...modeled, ...unmodeled];

    return components.length ? components : <NoComponents />;
  };

  return (
    <SpaceBetween size='m' direction='vertical'>
      {getComponents()}
    </SpaceBetween>
  );
};
