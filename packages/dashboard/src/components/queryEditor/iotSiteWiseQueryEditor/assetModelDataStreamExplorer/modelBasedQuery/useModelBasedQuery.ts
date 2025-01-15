import { type AssetResource } from '@iot-app-kit/react-components';
import isEqual from 'lodash-es/isEqual';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateWidgetsAction } from '~/store/actions';
import { type DashboardState } from '~/store/state';
import {
  type QueryConfigWidget,
  findModelBasedQueryWidgets,
  hasModelBasedQuery,
} from './findModelBasedQueryWidgets';

export const useModelBasedQuery = () => {
  const dispatch = useDispatch();
  const dashboardConfiguration = useSelector(
    (dashboardState: DashboardState) => dashboardState.dashboardConfiguration,
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
  const alarmAssetModel = useMemo(
    () => (firstWidget?.properties.queryConfig.query?.alarmModels ?? []).at(0),
    [firstWidget]
  );

  const updateModelBasedWidgets = useCallback(
    (updatedWidgets: QueryConfigWidget[]) => {
      dispatch(
        onUpdateWidgetsAction({
          widgets: updatedWidgets,
        })
      );
    },
    [dispatch]
  );

  const clearModelBasedWidgets = () => {
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
  };

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
    assetModelId: assetModel?.assetModelId ?? alarmAssetModel?.assetModelId,
    assetIds: assetModel?.assetIds ?? alarmAssetModel?.assetIds,
    hasModelBasedQuery: hasModelBasedQueryWidgets,
    modelBasedWidgets,
    updateModelBasedWidgets,
    clearModelBasedWidgets,
    updateSelectedAsset,
  };
};
