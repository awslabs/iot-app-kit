import React from 'react';

import './index.css';

export type IotGridProps = {
  width: number;
  stretchToFit: boolean;
  cellSize: number;
};

export const DASHBOARD_CONTAINER_ID = 'container';

const IotGrid: React.FC<IotGridProps> = ({ width, stretchToFit, cellSize, children }) => (
  <div
    id={DASHBOARD_CONTAINER_ID}
    tabIndex={0}
    className="container"
    style={{
      width: stretchToFit ? '100%' : `${width}px`,
      backgroundSize: `${cellSize}px`
    }}
  >
    <div className="grid-image" style={{ backgroundSize: `${cellSize}px` }} />
    { children }
  </div>
);

export default IotGrid;
