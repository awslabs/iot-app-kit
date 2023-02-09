import React from 'react';
import { AssetQuery } from '@iot-app-kit/core';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { onUpdateAssetQueryAction } from '../../store/actions/updateAssetQuery';
import { Widget, AppKitWidget } from '../../types';
import { ItemTypes } from '../dragLayer/itemTypes';

export type WidgetDropTargetProps = {
  widget: Widget;
  children: React.ReactNode;
};

export const WidgetDropTarget: React.FC<WidgetDropTargetProps> = ({ widget, children }) => {
  const dispatch = useDispatch();

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.ResourceExplorerAssetProperty,
      drop: ({ queryAssetsParam }: { queryAssetsParam: AssetQuery[] }) => {
        const newAssetQueries = queryAssetsParam;

        const appKitWidget = structuredClone(widget) as AppKitWidget;
        appKitWidget.widgetId = widget.id;

        const onUpdateAssetQueryActionParams = {
          assetQuery: newAssetQueries,
          widget: appKitWidget,
        };

        console.log(onUpdateAssetQueryActionParams);

        dispatch(onUpdateAssetQueryAction(onUpdateAssetQueryActionParams));
      },
    }),
    []
  );

  return <div ref={drop}>{children}</div>;
};
