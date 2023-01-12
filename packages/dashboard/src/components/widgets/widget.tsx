import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { DashboardMessages } from '../../messages';

import { DashboardConfiguration, Widget } from '../../types';
import { gestureable } from '../internalDashboard/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';
import { ItemTypes } from '../dragLayer/itemTypes';
import { AssetQuery } from '@iot-app-kit/core';

import './widget.css';

export type WidgetProps = {
  readonly: boolean;
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
  readonly,
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
      className="widget"
      style={{
        zIndex: z.toString(),
        top: `${cellSize * y}px`,
        left: `${cellSize * x}px`,
        width: `${cellSize * width}px`,
        height: `${cellSize * height}px`,
      }}
    >
      <DynamicWidgetComponent
        readonly={readonly}
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
