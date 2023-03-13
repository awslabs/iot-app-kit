import React from 'react';
import { useDrop } from 'react-dnd';

import { useWidgetActions } from '../../hooks/useWidgetActions';
import { ItemTypes } from '~/components/dragLayer/itemTypes';
import { assignDefaultStyles } from '../utils/assignDefaultStyleSettings';
import { mergeAssetQueries } from '~/util/mergeAssetQueries';
import './queryWidget.css';
import type { ReactNode } from 'react';
import type { QueryWidget } from '../types';
import type { ResourcePanelItem } from '~/components/resourceExplorer/components/panel';

/**
 *
 * HOC widget component for handling drag and drop of a widget that can have multiple assets per query
 *
 */
const MultiQueryWidgetComponent: React.FC<QueryWidget & { children: ReactNode }> = ({ children, ...widget }) => {
  const { update } = useWidgetActions<QueryWidget>();

  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.ResourceExplorerAssetProperty, ItemTypes.ResourceExplorerAlarm],
      drop: ({ assetSummary }: ResourcePanelItem) => {
        const currentAssets = widget.properties.queryConfig.query?.assets ?? [];

        const mergedAssets = mergeAssetQueries(currentAssets, {
          assetId: assetSummary.assetId || '',
          properties: assetSummary.properties.map(({ propertyId }) => ({
            propertyId: propertyId || '',
          })),
        });

        const updatedWidget = {
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
