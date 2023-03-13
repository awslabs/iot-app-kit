import React from 'react';
import { useDrop } from 'react-dnd';
import { useWidgetActions } from '../../hooks/useWidgetActions';
import { ItemTypes } from '~/components/dragLayer/itemTypes';
import { assignDefaultStyles } from '../utils/assignDefaultStyleSettings';
import './queryWidget.css';
import { mergeAssetQueries } from '~/util/mergeAssetQueries';
import type { ReactNode } from 'react';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import type { QueryWidget } from '../types';

/**
 *
 * HOC widget component for handling drag and drop of a widget that can have multiple assets per query
 *
 */
const MultiQueryWidgetComponent: React.FC<QueryWidget & { children: ReactNode }> = ({ children, ...widget }) => {
  const { update } = useWidgetActions<QueryWidget>();

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.ResourceExplorerAssetProperty,
      drop: ({ queryAssetsParam }: { queryAssetsParam: SiteWiseAssetQuery['assets'] }) => {
        const asset = queryAssetsParam[0];

        const updatedWidget = {
          ...widget,
          properties: {
            ...widget.properties,
            queryConfig: {
              ...widget.properties.queryConfig,
              query: {
                assets: mergeAssetQueries(widget.properties.queryConfig.query?.assets || [], asset),
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
