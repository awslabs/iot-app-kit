import { useSelection } from '~/customization/propertiesSection';
import { QueryConfigWidget, isQueryWidget } from './findModelBasedQueryWidgets';
import { QueryProperties } from '~/customization/widgets/types';
import { isJust, maybeWithDefault } from '~/util/maybe';
import { noop } from 'lodash';
import { AssetModelQuery } from '@iot-app-kit/source-iotsitewise';
import { styledQueryWidgetOnDrop } from '~/components/queryEditor/useQuery';
import { assignDefaultStyles } from '~/customization/widgets/utils/assignDefaultStyleSettings';
import { IoTSiteWiseDataStreamQuery } from '~/types';

const mergeAssetModelProperties = (
  currentQuery: QueryConfigWidget['properties']['queryConfig']['query'],
  updatedAssetModels: AssetModelQuery[] | undefined = []
) => {
  const currentAssetModels = currentQuery?.assetModels ?? [];
  return updatedAssetModels.map((assetModel) => ({
    ...assetModel,
    properties: assetModel.properties.map((property) => {
      const currentProperty = currentAssetModels
        .find(
          (currentAssetModel) =>
            currentAssetModel.assetModelId === assetModel.assetModelId
        )
        ?.properties.find(
          (currentAssetModelProperty) =>
            currentAssetModelProperty.propertyId === property.propertyId
        );
      return {
        ...currentProperty,
        ...property,
      };
    }),
  }));
};

export const useModelBasedQuerySelection = () => {
  const selection = useSelection({ filter: isQueryWidget });

  // xy-plot widgets are styled query objects
  const selectionType = selection?.type;

  const defaultQuery: QueryProperties = {
    queryConfig: {
      source: 'iotsitewise',
      query: undefined,
    },
  };

  const [propertiesMaybe, setProperties] = selection?.useProperty(
    (properties) => properties,
    (_properties, updatedProperties) => updatedProperties
  ) ?? [undefined, noop];

  const properties = propertiesMaybe
    ? maybeWithDefault(defaultQuery, propertiesMaybe) ?? defaultQuery
    : defaultQuery;

  const updateAssetModels = (
    updatedAssetModels: AssetModelQuery[] | undefined
  ) => {
    // Only allow updates for a single widget type at a time.
    // This is necessary because xy-plot query config has a different structure
    if (!selectionType || !isJust(selectionType)) return;

    let updatedProperties = { ...properties };
    const compositeWidgetForAggregationInformation = {
      type: selectionType.value,
      properties,
    } as QueryConfigWidget;
    // handle styled widget
    if (selectionType.value === 'xy-plot') {
      const styledQuery = styledQueryWidgetOnDrop(
        {
          ...compositeWidgetForAggregationInformation.properties.queryConfig
            .query,
          assetModels: mergeAssetModelProperties(
            compositeWidgetForAggregationInformation.properties.queryConfig
              .query,
            updatedAssetModels
          ),
        },
        compositeWidgetForAggregationInformation
      );
      updatedProperties = {
        ...properties,
        queryConfig: {
          ...properties.queryConfig,
          query: {
            ...properties.queryConfig.query,
            assetModels: (styledQuery as unknown as IoTSiteWiseDataStreamQuery)
              .assetModels,
          },
        },
      };
    } else {
      const styledProperties = assignDefaultStyles({
        ...compositeWidgetForAggregationInformation,
        properties: {
          ...compositeWidgetForAggregationInformation.properties,
          queryConfig: {
            ...compositeWidgetForAggregationInformation.properties.queryConfig,
            query: {
              ...compositeWidgetForAggregationInformation.properties.queryConfig
                .query,
              assetModels: mergeAssetModelProperties(
                compositeWidgetForAggregationInformation.properties.queryConfig
                  .query,
                updatedAssetModels
              ),
            },
          },
        },
      }).properties;
      updatedProperties = {
        ...styledProperties,
      };
    }

    setProperties(updatedProperties);
  };

  const assetModels = properties.queryConfig.query?.assetModels ?? [];

  return {
    updateAssetModels,
    assetModels,
    modelBasedWidgetsSelected: !!selection,
  };
};
