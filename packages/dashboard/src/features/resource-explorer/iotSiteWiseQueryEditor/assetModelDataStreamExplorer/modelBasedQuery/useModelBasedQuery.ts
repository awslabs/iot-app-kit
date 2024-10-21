import { type AssetResource } from '@iot-app-kit/react-components';
import { isEqual } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useUpdateWidgets } from '~/store/dashboard/use-update-widgets';
import { useStoreSelector } from '~/store/hooks';
import {
  type QueryConfigWidget,
  findModelBasedQueryWidgets,
  hasModelBasedQuery,
} from './findModelBasedQueryWidgets';

export const useModelBasedQuery = () => {
  const updateWidgets = useUpdateWidgets();
  const dashboardConfiguration = useStoreSelector(
    (state) => state.dashboard.present.dashboardConfiguration,
    isEqual
  );
  const modelBasedWidgets = useMemo(
    () => findModelBasedQueryWidgets(dashboardConfiguration),
    [dashboardConfiguration]
  );
  const hasModelBasedQueryWidgets = hasModelBasedQuery(dashboardConfiguration);
  const firstWidget = useMemo(
    () => modelBasedWidgets.at(0),
    [modelBasedWidgets]
  );
  const assetModel = useMemo(
    () => (firstWidget?.properties.queryConfig.query?.assetModels ?? []).at(0),
    [firstWidget]
  );

  const updateModelBasedWidgets = useCallback(
    (updatedWidgets: QueryConfigWidget[]) => {
      updateWidgets(updatedWidgets);
    },
    [updateWidgets]
  );

  const clearModelBasedWidgets = useCallback(() => {
    const clearedModelBasedWidgets = modelBasedWidgets.map(
      ({ properties, ...rest }) => ({
        ...rest,
        properties: {
          ...properties,
          queryConfig: {
            ...properties.queryConfig,
            query: {
              ...properties.queryConfig.query,
              assetModels: [],
              alarmModels: [],
            },
          },
        },
      })
    );

    updateModelBasedWidgets(clearedModelBasedWidgets);
  }, [modelBasedWidgets, updateModelBasedWidgets]);

  const updateSelectedAsset = useCallback(
    (updatedSelectedAsset?: AssetResource) => {
      if (!updatedSelectedAsset || updatedSelectedAsset.assetId === undefined)
        return;
      const id = updatedSelectedAsset.assetId;
      const updatedSelectedAssets = modelBasedWidgets.map(
        ({ properties, ...rest }) => ({
          ...rest,
          properties: {
            ...properties,
            queryConfig: {
              ...properties.queryConfig,
              query: {
                ...properties.queryConfig.query,
                assetModels: (
                  properties.queryConfig.query?.assetModels ?? []
                ).map((assetModel) => ({
                  ...assetModel,
                  assetIds: [id],
                })),
                alarmModels: (
                  properties.queryConfig.query?.alarmModels ?? []
                ).map((alarmModel) => ({
                  ...alarmModel,
                  assetIds: [id],
                })),
              },
            },
          },
        })
      );

      updateModelBasedWidgets(updatedSelectedAssets);
    },
    [updateModelBasedWidgets, modelBasedWidgets]
  );

  return {
    assetModelId: assetModel?.assetModelId,
    assetIds: assetModel?.assetIds,
    hasModelBasedQuery: hasModelBasedQueryWidgets,
    modelBasedWidgets,
    updateModelBasedWidgets,
    clearModelBasedWidgets,
    updateSelectedAsset,
  };
};
