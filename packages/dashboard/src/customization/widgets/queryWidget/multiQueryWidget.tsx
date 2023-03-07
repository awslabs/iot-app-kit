import React from 'react';
import { useDrop } from 'react-dnd';

import { useWidgetActions } from '../../hooks/useWidgetActions';
import { ItemTypes } from '~/components/dragLayer/itemTypes';
import { QueryWidget } from '../types';
import { assignDefaultStyles } from '../utils/assignDefaultStyleSettings';
import './queryWidget.css';
import { mergeAssetQueries } from '~/util/mergeAssetQueries';
import { ExtendedPanelAssetSummary } from '~/components/resourceExplorer/nextResourceExplorer';

/**
 *
 * HOC widget component for handling drag and drop of a widget that can have multiple assets per query
 *
 */
const MultiQueryWidgetComponent: React.FC<
  QueryWidget & {
    updateWidgetDefinition?: (params: { assetSummary: ExtendedPanelAssetSummary; widget: QueryWidget }) => QueryWidget;
  }
> = ({ children, updateWidgetDefinition, ...widget }) => {
  const { update } = useWidgetActions<QueryWidget>();

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.ResourceExplorerAssetProperty,
      drop: (assetSummary: ExtendedPanelAssetSummary = { queryAssetsParam: [] }) => {
        const { queryAssetsParam } = assetSummary;
        if (updateWidgetDefinition == null) {
          const asset = queryAssetsParam?.[0];
          if (asset) {
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
          }
        } else {
          update(updateWidgetDefinition({ assetSummary, widget }));
        }
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
