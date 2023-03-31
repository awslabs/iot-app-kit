import type { ReactNode } from 'react';
import React from 'react';
import { useDrop } from 'react-dnd';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { Box } from '@cloudscape-design/components';

import { useWidgetActions } from '../../hooks/useWidgetActions';
import { ItemTypes } from '~/components/dragLayer/itemTypes';
import { assignDefaultStyles } from '../utils/assignDefaultStyleSettings';
import { mergeAssetQueries } from '~/util/mergeAssetQueries';
import type { QueryWidget } from '../types';
import type { ResourcePanelItem } from '~/components/resourceExplorer/components/panel';
import { isDefined } from '~/util/isDefined';

import './queryWidget.css';

export type onDropHandler<W extends QueryWidget = QueryWidget> = (item: ResourcePanelItem, widget: W) => W;
export const defaultOnDropHandler: onDropHandler = (item, widget) => {
  const { assetSummary } = item;
  const currentAssets = widget.properties.queryConfig.query?.assets ?? [];

  const mergedAssets = mergeAssetQueries(currentAssets, {
    assetId: assetSummary.assetId || '',
    properties: assetSummary.properties.map(({ propertyId }) => ({
      propertyId: propertyId || '',
    })),
  });

  return {
    ...widget,
    properties: {
      ...widget.properties,
      queryConfig: {
        ...widget.properties.queryConfig,
        query: {
          assets: mergedAssets,
        },
      },
    },
  };
};
/**
 *
 * HOC widget component for handling drag and drop of a widget that can have multiple assets per query
 *
 */
const MultiQueryWidgetComponent: React.FC<
  QueryWidget & { children: ReactNode; onDropHandler?: onDropHandler; allowedDataTypes?: PropertyDataType[] }
> = ({
  children,
  onDropHandler = defaultOnDropHandler,
  allowedDataTypes = [
    PropertyDataType.BOOLEAN,
    PropertyDataType.DOUBLE,
    PropertyDataType.INTEGER,
    PropertyDataType.STRING,
    PropertyDataType.STRUCT,
  ],
  ...widget
}) => {
  const { update } = useWidgetActions<QueryWidget>();

  const [collected, drop] = useDrop(
    () => ({
      accept: [ItemTypes.ResourceExplorerAssetProperty, ItemTypes.ResourceExplorerAlarm],
      drop: (item: ResourcePanelItem) => {
        const updatedWidget = onDropHandler(item, widget);
        update(assignDefaultStyles(updatedWidget));
      },
      canDrop: (item, monitor) =>
        monitor.getItemType() === ItemTypes.ResourceExplorerAlarm ||
        item.assetSummary.properties
          .map(({ dataType }) => dataType)
          .filter(isDefined)
          .every((type) => allowedDataTypes.includes(type as PropertyDataType)),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [widget]
  );

  const { canDrop, isOver } = collected;

  return (
    <div ref={drop} className='query-widget'>
      {isOver && !canDrop ? (
        <div className='query-widget-drop-disabled'>
          <Box color='text-status-error' variant='p' textAlign='center'>
            Data type not compatible.
          </Box>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default MultiQueryWidgetComponent;
