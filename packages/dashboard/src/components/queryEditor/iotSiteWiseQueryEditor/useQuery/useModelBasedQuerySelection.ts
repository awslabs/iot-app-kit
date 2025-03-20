import {
  type AlarmAssetModelQuery,
  type AssetModelQuery,
} from '@iot-app-kit/source-iotsitewise';
import { useSelectedWidgets } from '~/features/selection/use-selected-widgets';
import { assignDefaultStyles } from '~/components/queryEditor/iotSiteWiseQueryEditor/useQuery/asset-default-styles';
import { type IoTSiteWiseDataStreamQuery } from '~/features/queries/queries';
import { useWidgetSetting } from '~/features/widget-customization/settings/use-widget-setting';
import { styledQueryWidgetOnDrop } from '~/components/queryEditor/iotSiteWiseQueryEditor/useQuery/useQuery';
import { DEFAULT_QUERY_CONFIG } from '~/features/queries/defaults';
import { isQueryWidgetInstance } from '~/components/queryEditor/iotSiteWiseQueryEditor/useQuery/findModelBasedQueryWidgets';

const mergeAssetModelProperties = (
  currentQuery: IoTSiteWiseDataStreamQuery | undefined,
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

const mergeAlarmModelCompositeModelIds = (
  currentQuery: IoTSiteWiseDataStreamQuery | undefined,
  updatedAlarmModels: AlarmAssetModelQuery[] | undefined = []
) => {
  const currentAlarmModels = currentQuery?.alarmModels ?? [];
  return updatedAlarmModels.map((alarmModel) => ({
    ...alarmModel,
    alarmComponents: alarmModel.alarmComponents.map((alarm) => {
      const currentAlarm = currentAlarmModels
        .find(
          (currentAssetModel) =>
            currentAssetModel.assetModelId === alarmModel.assetModelId
        )
        ?.alarmComponents.find(
          (currentAlarmModelAlarm) =>
            currentAlarmModelAlarm.assetCompositeModelId ===
            alarm.assetCompositeModelId
        );
      return {
        ...currentAlarm,
        ...alarm,
      };
    }),
  }));
};

export const useModelBasedQuerySelection = () => {
  const selectedWidget = useSelectedWidgets().at(0);

  const [_properties, setProperties] = useWidgetSetting(
    selectedWidget,
    'properties'
  );

  const updateModelQueries = ({
    alarmModels: updatedAlarmModels,
    assetModels: updatedAssetModels,
  }: {
    alarmModels: AlarmAssetModelQuery[] | undefined;
    assetModels: AssetModelQuery[] | undefined;
  }) => {
    if (selectedWidget == null || !isQueryWidgetInstance(selectedWidget))
      return;

    // handle styled widget
    if (selectedWidget?.type === 'xy-plot') {
      const styledQuery = styledQueryWidgetOnDrop(
        {
          ...selectedWidget.properties.queryConfig.query,
          alarmModels: mergeAlarmModelCompositeModelIds(
            selectedWidget.properties.queryConfig.query,
            updatedAlarmModels
          ),
          assetModels: mergeAssetModelProperties(
            selectedWidget.properties.queryConfig.query,
            updatedAssetModels
          ),
        },
        selectedWidget
      ) satisfies IoTSiteWiseDataStreamQuery;

      setProperties({
        ...selectedWidget.properties,
        queryConfig: {
          ...selectedWidget.properties.queryConfig,
          query: {
            ...selectedWidget.properties.queryConfig.query,
            alarmModels: styledQuery.alarmModels,
            assetModels: styledQuery.assetModels,
          },
        },
      });
    } else {
      setProperties(
        assignDefaultStyles({
          ...selectedWidget,
          properties: {
            ...selectedWidget.properties,
            queryConfig: {
              ...(selectedWidget.properties.queryConfig ??
                DEFAULT_QUERY_CONFIG),
              query: {
                ...selectedWidget.properties.queryConfig?.query,
                alarmModels: mergeAlarmModelCompositeModelIds(
                  selectedWidget.properties.queryConfig?.query,
                  updatedAlarmModels
                ),
                assetModels: mergeAssetModelProperties(
                  selectedWidget.properties.queryConfig?.query,
                  updatedAssetModels
                ),
              },
            },
          },
        }).properties
      );
    }
  };

  const assetModels =
    selectedWidget != null && isQueryWidgetInstance(selectedWidget)
      ? selectedWidget.properties.queryConfig?.query?.assetModels ?? []
      : [];

  return {
    updateModelQueries,
    assetModels,
    modelBasedWidgetsSelected: Boolean(selectedWidget),
  };
};
