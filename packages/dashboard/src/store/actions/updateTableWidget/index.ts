import { AssetQuery } from '@iot-app-kit/core';
import { Action } from 'redux';
import { DashboardState } from '~/store/state';
import { ColumnDefinition, Item } from '@iot-app-kit/table';
import { Widget } from '~/types';
import { toId } from '@iot-app-kit/source-iotsitewise';

type UpdateTableAssetPayload = {
  widget: Widget;
  assetQuery: AssetQuery[];
};

export interface UpdateTableAssetsAction extends Action {
  type: 'UPDATE_TABLE_ASSET';
  payload: UpdateTableAssetPayload;
}

export const onUpdateTableAssets = (payload: UpdateTableAssetPayload): UpdateTableAssetsAction => ({
  type: 'UPDATE_TABLE_ASSET',
  payload,
});

export const updateTableAssets = (state: DashboardState, action: UpdateTableAssetsAction): DashboardState => {
  const { assetQuery, widget } = action.payload;
  if (widget.componentTag !== 'iot-table') return state;

  const descriptionMap = state.assetsDescriptionMap;

  const propertyNames: string[] = [];
  const items = assetQuery.map<Item>(({ assetId, properties }) => {
    const item: Item = {};

    properties.forEach(({ propertyId }) => {
      const name = descriptionMap[assetId]?.assetProperties?.find((p) => p.id === propertyId)?.name || propertyId;
      item[name] = {
        $cellRef: {
          id: toId({ assetId, propertyId }),
          resolution: 0,
        },
      };
      if (!propertyNames.includes(name)) {
        propertyNames.push(name);
      }
    });
    return item;
  });
  const columnDefinitions: ColumnDefinition[] = propertyNames.map((name) => ({ key: name, header: name }));
  const updateWidget: (widgets: Widget) => Widget = (w) => {
    if (w.id === widget.id) {
      return {
        ...w,
        items,
        columnDefinitions,
      };
    }
    return w;
  };
  const widgets = state.dashboardConfiguration.widgets.map(updateWidget);
  const selectedWidgets = state.selectedWidgets.map(updateWidget);
  return {
    ...state,
    selectedWidgets,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets,
    },
  };
};
