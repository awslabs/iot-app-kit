import { Box } from '@cloudscape-design/components';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React, { FC } from 'react';
import { StyledAssetQuery } from '~/customization/widgets/types';
import { isJust } from '~/helpers/maybe';
import {
  AssetSummary,
  useAssetDescriptionMapQuery,
} from '~/hooks/useAssetDescriptionQueries';
import { useAssetModel } from '~/hooks/useAssetModel/useAssetModel';
import { SelectOneWidget } from '../shared/selectOneWidget';
import { handleDeleteAssetModelProperty } from './handleDeleteAssetModelProperty';
import { handleRemoveAlarm } from './handleRemoveAlarm';
import { defaultOnDeleteQuery } from './onDeleteProperty';
import { PropertyComponent } from './propertyComponent';
import { StyledPropertiesAlarmsSectionProps } from './sectionTypes';
import { StyledPropertyComponent } from './styledPropertyComponent';

const NoComponents = () => <Box variant='p'>No properties or alarms found</Box>;

export const StyledPropertiesAlarmsSection: FC<
  StyledPropertiesAlarmsSectionProps
> = ({
  queryConfig,
  updateQueryConfig,
  client,
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

  const styledAssetQuery =
    (editablePropertiesAndAlarms && queryConfig.value.query) || undefined;

  const describedAssetsMap =
    useAssetDescriptionMapQuery(styledAssetQuery).data ?? {};

  const assetModelIds = (styledAssetQuery?.assetModels ?? []).map(
    ({ assetModelId }) => assetModelId
  );
  const { assetModels } = useAssetModel({
    assetModelIds,
    iotSiteWiseClient: client,
  });

  const getComponents = () => {
    if (mustEditAsSingle) return <SelectOneWidget />;

    const updateSiteWiseAssetQuery = (newQuery: StyledAssetQuery) => {
      updateQueryConfig({
        ...queryConfig.value,
        query: newQuery,
      });
    };

    const onUpdatePropertyStyles = (
      {
        updatedAssetId,
        updatedPropertyId,
        updatedAssetModelId,
      }: {
        updatedAssetId?: string;
        updatedPropertyId?: string;
        updatedAssetModelId?: string;
      },
      newStyles: object
    ) => {
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
        assetModels:
          styledAssetQuery?.assetModels?.map((assetModel) => {
            if (assetModel.assetModelId === updatedAssetModelId) {
              return {
                ...assetModel,
                properties: assetModel.properties.map((property) => {
                  if (property.propertyId === updatedPropertyId) {
                    return { ...property, ...newStyles };
                  } else {
                    return property;
                  }
                }),
              };
            } else {
              return assetModel;
            }
          }) ?? [],
      };

      updateSiteWiseAssetQuery(newQuery);
    };

    const modeled =
      styledAssetQuery?.assets?.flatMap(({ assetId, properties }) =>
        properties.map((property, index) =>
          describedAssetsMap[assetId] ? (
            <StyledPropertyComponent
              index={index}
              key={`${assetId}-${property.propertyId}`}
              assetSummary={describedAssetsMap[assetId]}
              property={property}
              updateStyle={(newStyles: object) =>
                onUpdatePropertyStyles(
                  {
                    updatedAssetId: assetId,
                    updatedPropertyId: property.propertyId,
                  },
                  newStyles
                )
              }
              onDeleteAssetQuery={onDeleteAssetQuery({
                assetId,
                propertyId: property.propertyId,
                siteWiseAssetQuery: styledAssetQuery,
                updateSiteWiseAssetQuery,
              })}
              colorable={colorable}
            />
          ) : null
        )
      ) ?? [];

    const unmodeled =
      styledAssetQuery?.properties?.map((property, index) => {
        return (
          <StyledPropertyComponent
            index={index}
            key={property.propertyAlias}
            assetSummary={{
              assetId: '',
              assetName: '',
              properties: [],
              alarms: [],
            }}
            property={{ ...property, propertyId: property.propertyAlias }}
            updateStyle={(newStyles: object) =>
              onUpdatePropertyStyles(
                { updatedPropertyId: property.propertyAlias },
                newStyles
              )
            }
            onDeleteAssetQuery={onDeleteAssetQuery({
              assetId: '',
              propertyId: property.propertyAlias,
              siteWiseAssetQuery: styledAssetQuery,
              updateSiteWiseAssetQuery,
            })}
            colorable={colorable}
          />
        );
      }) ?? [];

    const assetModeled =
      styledAssetQuery?.assetModels?.flatMap(({ assetModelId, properties }) =>
        properties.map((property, index) => {
          const assetModel = assetModels?.at(0); //we dont support multiselect right now, so this will always be correct
          if (!assetModel) return null;

          const convertedAssetSummary: AssetSummary = {
            assetId: assetModelId,
            assetName: assetModel.at(0)?.path?.[0].name,
            properties:
              assetModel.map((a) => ({
                propertyId: a.id,
                name: a.name,
                unit: a.unit,
                dataType: a.dataType,
                alias: a.name,
              })) ?? [],
            alarms: [],
          };

          return (
            <StyledPropertyComponent
              index={index}
              key={`${assetModelId}-${property.propertyId}`}
              assetSummary={convertedAssetSummary}
              property={property}
              updateStyle={(newStyles: object) =>
                onUpdatePropertyStyles(
                  {
                    updatedAssetModelId: assetModelId,
                    updatedPropertyId: property.propertyId,
                  },
                  newStyles
                )
              }
              onDeleteAssetQuery={() =>
                updateSiteWiseAssetQuery(
                  handleDeleteAssetModelProperty(styledAssetQuery, {
                    assetModelId,
                    propertyId: property.propertyId,
                  }) as StyledAssetQuery
                )
              }
              colorable={colorable}
            />
          );
        })
      ) ?? [];

    const alarms =
      styledAssetQuery?.alarms?.flatMap(({ assetId, alarmComponents }) =>
        alarmComponents.map(({ assetCompositeModelId }) => {
          const refId = assetCompositeModelId;

          const describedAsset = describedAssetsMap[assetId];
          const compositeAssetModel =
            describedAsset?.assetCompositeModels?.find(
              (model) => model.id === assetCompositeModelId
            );

          if (!compositeAssetModel) return null;

          const onDelete = () => {
            updateSiteWiseAssetQuery({
              ...styledAssetQuery,
              alarms: handleRemoveAlarm(
                { alarms: styledAssetQuery.alarms ?? [] },
                { assetId, assetCompositeModelId }
              ),
            });
          };

          return (
            <PropertyComponent
              key={`${assetId}-${assetCompositeModelId}`}
              propertyId={assetCompositeModelId}
              refId={refId}
              assetSummary={{
                assetId: assetId,
                assetName: describedAsset.assetName,
                properties: [
                  {
                    propertyId: assetCompositeModelId,
                    name: compositeAssetModel.name,
                    unit: undefined,
                    dataType: undefined,
                    alias: undefined,
                  },
                ],
                alarms: [],
              }}
              styleSettings={{}}
              onDeleteAssetQuery={onDelete}
              onUpdatePropertyColor={() => {}}
              onUpdatePropertyName={() => {}}
              colorable={false}
              nameable={false}
            />
          );
        })
      ) ?? [];

    const components = [...modeled, ...unmodeled, ...assetModeled, ...alarms];

    return components.length ? components : <NoComponents />;
  };

  return (
    <SpaceBetween size='m' direction='vertical'>
      {getComponents()}
    </SpaceBetween>
  );
};
