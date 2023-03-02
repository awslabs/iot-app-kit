import { AssetQuery } from '@iot-app-kit/core';
import { Action } from 'redux';

import { AppKitWidget, Widget } from '~/types';
import { DashboardState } from '../../state';
import { colorPalette } from '~/util/colorPalette';

type UpdateAssetQueryActionPayload = {
  widget: AppKitWidget;
  assetQuery: AssetQuery[];
};

export interface UpdateAssetQueryAction extends Action {
  type: 'UPDATE_ASSET_QUERY';
  payload: UpdateAssetQueryActionPayload;
}

const assignDefaultRefId = (queries: AssetQuery[]) => {
  return queries.map<AssetQuery>(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      refId: propertyQuery.refId || propertyQuery.propertyId,
    })),
  }));
};
export const onUpdateAssetQueryAction = (payload: UpdateAssetQueryActionPayload): UpdateAssetQueryAction => {
  const { widget, assetQuery } = payload;
  const styleSettings = (widget as AppKitWidget).styleSettings || {};

  const assetQueryWithRefId = assignDefaultRefId(assetQuery);
  // assign default color
  assetQueryWithRefId
    .flatMap(({ properties }) => properties)
    .forEach(({ refId }, index) => {
      if (refId && !styleSettings[refId]) {
        styleSettings[refId] = {
          color: colorPalette[index % colorPalette.length],
        };
      }
    });

  return {
    type: 'UPDATE_ASSET_QUERY',
    payload: { widget: { ...widget, styleSettings }, assetQuery: assetQueryWithRefId },
  };
};

export const updateAssetQuery = (state: DashboardState, action: UpdateAssetQueryAction): DashboardState => {
  const findAndUpdateWidgetById = (widgets: Widget[]) =>
    widgets.map((w) => {
      if (w.id === action.payload.widget.id) {
        return {
          ...action.payload.widget,
          assets: action.payload.assetQuery,
        };
      }
      return w;
    });

  const updatedWidgetList = findAndUpdateWidgetById(state.dashboardConfiguration.widgets);
  const selectedWidgets = findAndUpdateWidgetById(state.selectedWidgets);

  return {
    ...state,
    selectedWidgets,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: updatedWidgetList,
    },
  };
};
