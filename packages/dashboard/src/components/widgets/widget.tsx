import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { AssetQuery } from '@iot-app-kit/core';
import { StatusIndicator } from '@cloudscape-design/components';

import { DashboardMessages } from '~/messages';
import { DashboardConfiguration, Widget } from '~/types';
import useWritableSiteWiseProperty from '~/components/widgets/primitives/input/hooks/useWritableSiteWiseProperty';
import { gestureable, idable } from '../internalDashboard/gestures/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';
import { ItemTypes } from '../dragLayer/itemTypes';

import './widget.css';

export type WidgetProps = {
  readOnly: boolean;
  query?: SiteWiseQuery;
  isSelected: boolean;
  cellSize: number;
  widget: Widget;
  widgets: Widget[];
  viewport: DashboardConfiguration['viewport'];
  messageOverrides: DashboardMessages;
};

const WidgetComponent: React.FC<WidgetProps> = ({
  cellSize,
  widget,
  viewport,
  messageOverrides,
  query,
  readOnly,
  isSelected,
}) => {
  const { x, y, z, width, height } = widget;

  // TODO: Replace with Redux dispatch
  const [assets, setAssets] = useState<null | AssetQuery[]>(null);
  const [internalWidget, setInternalWidget] = useState(widget);
  const [error, setError] = useState<string | null>(null);
  const isWritable = useWritableSiteWiseProperty();
  const isInputWidget = internalWidget.componentTag === 'input';

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.ResourceExplorerAssetProperty,
      drop: async ({ queryAssetsParam }: { queryAssetsParam: AssetQuery[] }) => {
        // TODO: decouple this from drop callback
        if (isInputWidget) {
          const assetId = queryAssetsParam[0]?.assetId;
          const propertyId = queryAssetsParam[0]?.properties?.[0].propertyId;
          const { writable } = await isWritable({ assetId, propertyId });
          if (writable) {
            setAssets(queryAssetsParam);
          }
        } else {
          setAssets(queryAssetsParam);
        }
        setError(null);
      },
      hover: async ({ queryAssetsParam }: { queryAssetsParam: AssetQuery[] }, monitor) => {
        // TODO: decouple this from hover callback
        if (isInputWidget && monitor.isOver()) {
          const assetId = queryAssetsParam[0]?.assetId;
          const propertyId = queryAssetsParam[0]?.properties?.[0].propertyId;
          const { error } = await isWritable({ assetId, propertyId });
          if (error) {
            setError(error);
          }
        } else {
          setError(null);
        }
      },
    }),
    []
  );

  useEffect(() => {
    const nextInternalWidget = structuredClone(widget);
    if (assets) {
      nextInternalWidget.assets = assets as any;
    }
    setInternalWidget(nextInternalWidget);
  }, [JSON.stringify(widget), JSON.stringify(assets)]);

  return (
    <div
      ref={drop}
      {...gestureable('widget')}
      {...idable(widget.id)}
      className={`widget ${readOnly ? 'widget-readonly' : ''}`}
      style={{
        zIndex: z.toString(),
        top: `${cellSize * y}px`,
        left: `${cellSize * x}px`,
        width: `${cellSize * width}px`,
        height: `${cellSize * height}px`,
      }}
    >
      <DynamicWidgetComponent
        readOnly={readOnly}
        query={query}
        viewport={viewport}
        widget={internalWidget}
        isSelected={isSelected}
        widgetsMessages={messageOverrides.widgets}
      />
      {error && <StatusIndicator type='error'>{error}</StatusIndicator>}
    </div>
  );
};

export default WidgetComponent;
