import React from 'react';
import {
  colorTextBodySecondary,
  spaceStaticS,
  spaceStaticXs,
  spaceStaticXxl,
  spaceStaticXxxl,
} from '@cloudscape-design/design-tokens';

import { default as lineSvg } from '../../customization/widgets/lineScatterChart/line.svg';
import './dashboardEmptyState.css';

const emptyState = {
  borderColor: colorTextBodySecondary,
  borderRadius: spaceStaticXs,
  padding: spaceStaticXxxl,
};

const DashboardEmptyState: React.FC = () => {
  return (
    <div
      data-testid='empty-state'
      className='dashboard-empty-state'
      style={emptyState}
    >
      <div style={{ margin: spaceStaticXxl }}>
        <img
          style={{ margin: spaceStaticS }}
          src={lineSvg}
          alt='Line widget light icon'
        />
        <div>Drag and drop your widget to the canvas.</div>
      </div>
    </div>
  );
};

export default DashboardEmptyState;
