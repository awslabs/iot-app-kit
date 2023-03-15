import type { ReactNode } from 'react';
import React from 'react';
import { useDrop } from 'react-dnd';

import { useWidgetActions } from '../../hooks/useWidgetActions';
import { ItemTypes } from '~/components/dragLayer/itemTypes';
import { assignDefaultStyles } from '../utils/assignDefaultStyleSettings';
import { mergeAssetQueries } from '~/util/mergeAssetQueries';
import './queryWidget.css';
import type { QueryWidget } from '../types';
import type { ResourcePanelItem } from '~/components/resourceExplorer/components/panel';

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
const MultiQueryWidgetComponent: React.FC<QueryWidget & { children: ReactNode; onDropHandler?: onDropHandler }> = ({
  children,
  onDropHandler = defaultOnDropHandler,
  ...widget
}) => {
  const { update } = useWidgetActions<QueryWidget>();

  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.ResourceExplorerAssetProperty, ItemTypes.ResourceExplorerAlarm],
      drop: (item: ResourcePanelItem) => {
        const updatedWidget = onDropHandler(item, widget);
        update(assignDefaultStyles(updatedWidget));
      },
    }),
    [widget]
  );

  return (
    <div ref={drop} className='query-widget'>
      {children}
    </div>
  );
};

export default MultiQueryWidgetComponent;
