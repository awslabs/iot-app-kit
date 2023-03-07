import React, { ReactNode } from 'react';
import { useDrop } from 'react-dnd';

import { useWidgetActions } from '../../hooks/useWidgetActions';
import { ItemTypes } from '~/components/dragLayer/itemTypes';
import { QueryWidget } from '../types';
import { assignDefaultStyles } from '../utils/assignDefaultStyleSettings';

import { ResourcePanelItem } from '~/components/resourceExplorer/components/panel';

import './queryWidget.css';

/**
 *
 * HOC widget component for handling drag and drop of a widget that can have only 1 asset per query
 *
 * TODO handle extending alarm assets
 *
 */
const SingleQueryWidgetComponent: React.FC<QueryWidget & { children: ReactNode }> = ({ children, ...widget }) => {
  const { update } = useWidgetActions<QueryWidget>();

  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.ResourceExplorerAssetProperty, ItemTypes.ResourceExplorerAlarm],
      drop: ({ assetSummary }: ResourcePanelItem) => {
        const asset = {
          assetId: assetSummary.assetId || '',
          properties: assetSummary.properties.map(({ propertyId }) => ({
            propertyId: propertyId || '',
          })),
        };

        const updatedWidget = {
          ...widget,
          properties: {
            ...widget.properties,
            queryConfig: {
              ...widget.properties.queryConfig,
              query: { assets: [asset] },
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

export default SingleQueryWidgetComponent;
