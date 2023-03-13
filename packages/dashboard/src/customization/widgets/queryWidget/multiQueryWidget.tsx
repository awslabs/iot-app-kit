import React, { ReactNode } from 'react';
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
const defaultOnDropAssetToWidget = (
  assetSummary: ExtendedPanelAssetSummary,
  widget: QueryWidget,
  update: (widget: QueryWidget) => void
) => {
  const { queryAssetsParam = [] } = assetSummary;
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
};
const MultiQueryWidgetComponent: React.FC<
  QueryWidget & {
    children: ReactNode;
    onDropAsset?: (
      assetSummary: ExtendedPanelAssetSummary,
      widget: QueryWidget,
      update: (widget: QueryWidget) => void
    ) => void;
  }
> = ({ children, onDropAsset = defaultOnDropAssetToWidget, ...widget }) => {
  const { update } = useWidgetActions<QueryWidget>();

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.ResourceExplorerAssetProperty,
      drop: (summary: ExtendedPanelAssetSummary) => onDropAsset(summary, widget, update),
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
