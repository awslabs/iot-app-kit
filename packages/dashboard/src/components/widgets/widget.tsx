import React from 'react';
import { DashboardConfiguration, Widget } from '../../types';

import './widget.css';

export type IotWidgetProps = {
  isSelected: boolean;
  cellSize: number;
  widget: Widget;
  viewport: DashboardConfiguration['viewport'];
};

const IotWidget: React.FC<IotWidgetProps> = ({ cellSize, widget }) => {
  const { x, y, z, width, height, id, componentTag, queries, properties, annotations } = widget;
  console.log(widget);
  console.log(cellSize);

  return (
    <div
      className='widget'
      style={{
        zIndex: z.toString(),
        top: `${cellSize * (y - 1)}px`,
        left: `${cellSize * (x - 1)}px`,
        width: `${cellSize * width}px`,
        height: `${cellSize * height}px`,
      }}
    >
      Widget
    </div>
  );
}

export default IotWidget;
