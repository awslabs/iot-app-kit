import { DashboardState } from '~/store/state';
import { isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { QueryConfigWidget, findModelBasedQueryWidgets, hasModelBasedQuery } from './findModelBasedQueryWidgets';
import { useCallback, useMemo } from 'react';
import { onUpdateWidgetsAction } from '~/store/actions';
import { AssetSummary } from '@aws-sdk/client-iotsitewise';

export const useModelBasedQuery = () => {
  const dispatch = useDispatch();
  const dashboardConfiguration = useSelector(
    (dashboardState: DashboardState) => dashboardState.dashboardConfiguration,
    isEqual
  );
  const modelBasedWidgets = useMemo(() => findModelBasedQueryWidgets(dashboardConfiguration), [dashboardConfiguration]);
  const hasModelBasedQueryWidgets = hasModelBasedQuery(dashboardConfiguration);
  const firstWidget = useMemo(() => modelBasedWidgets.at(0), [modelBasedWidgets]);
  const assetModel = useMemo(() => (firstWidget?.properties.queryConfig.query?.assetModels ?? []).at(0), [firstWidget]);

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
    const clearedModelBasedWidgets = modelBasedWidgets.map(({ properties, ...rest }) => ({
      ...rest,
      properties: {
        ...properties,
        queryConfig: {
          ...properties.queryConfig,
          query: {
            ...properties.queryConfig.query,
            assetModels: [],
          },
        },
      },
    }));

    updateModelBasedWidgets(clearedModelBasedWidgets);
  };

  const updateSelectedAsset = useCallback(
    (updatedSelectedAsset?: AssetSummary) => {
      if (!updatedSelectedAsset || updatedSelectedAsset.id === undefined) return;
      const id = updatedSelectedAsset.id;
      const updatedSelectedAssets = modelBasedWidgets.map(({ properties, ...rest }) => ({
        ...rest,
        properties: {
          ...properties,
          queryConfig: {
            ...properties.queryConfig,
            query: {
              ...properties.queryConfig.query,
              assetModels: (properties.queryConfig.query?.assetModels ?? []).map((assetModel) => ({
                ...assetModel,
                assetIds: [id],
              })),
            },
          },
        },
      }));

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
