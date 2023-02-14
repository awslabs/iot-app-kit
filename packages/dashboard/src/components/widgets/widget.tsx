import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { DashboardMessages } from '../../messages';

import { DashboardConfiguration, Widget } from '../../types';
import { gestureable, idable } from '../internalDashboard/gestures/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';
import { ItemTypes } from '../dragLayer/itemTypes';
import { AssetQuery } from '@iot-app-kit/core';

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
  const [assets, setAssets] = useState<null | AssetQuery>(null);
  const [internalWidget, setInternalWidget] = useState(widget);

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.ResourceExplorerAssetProperty,
      drop: ({ queryAssetsParam }: { queryAssetsParam: AssetQuery }) => {
        setAssets(queryAssetsParam);
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
    </div>
  );
};

export default WidgetComponent;
