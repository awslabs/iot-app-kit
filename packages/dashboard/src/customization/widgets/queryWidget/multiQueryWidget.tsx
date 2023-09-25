import type { PropsWithChildren } from 'react';
import React, { useCallback } from 'react';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { Box } from '@cloudscape-design/components';

import { useWidgetActions } from '../../hooks/useWidgetActions';
import type { ResourcePanelItem } from '~/components/resourceExplorer/components/panel';
import { useMultiAssetPropertyDrop } from './useMultiAssetPropertyDrop';
import { DashboardWidget } from '~/types';

import './queryWidget.css';

type MultiQueryWidgetComponentOptions = PropsWithChildren<{
  widget: DashboardWidget;
  onDrop: (item: ResourcePanelItem, widget: DashboardWidget) => DashboardWidget;
  allowedDataTypes?: PropertyDataType[];
}>;

/**
 *
 * HOC widget component for handling drag and drop of a widget that can have multiple assets per query
 *
 */
const MultiQueryWidgetComponent: React.FC<MultiQueryWidgetComponentOptions> = ({
  children,
  widget,
  onDrop,
  allowedDataTypes = [
    PropertyDataType.BOOLEAN,
    PropertyDataType.DOUBLE,
    PropertyDataType.INTEGER,
    PropertyDataType.STRING,
    PropertyDataType.STRUCT,
  ],
}) => {
  const { update } = useWidgetActions();

  const dropCallback = useCallback((item: ResourcePanelItem) => update(onDrop(item, widget)), [widget, onDrop]);

  const [collected, drop] = useMultiAssetPropertyDrop({ drop: dropCallback, allowedDataTypes });

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
