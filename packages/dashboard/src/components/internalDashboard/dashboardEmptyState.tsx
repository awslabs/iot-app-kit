import {
  colorBorderSegmentDefault,
  colorTextBodyDefault,
  spaceStaticS,
  spaceStaticXs,
  spaceStaticXxl,
  spaceStaticXxxl,
} from '@cloudscape-design/design-tokens';

import { default as lineSvg } from '../../customization/widgets/lineScatterChart/line.svg';
import './dashboardEmptyState.css';

const emptyState = {
  borderColor: colorBorderSegmentDefault,
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
      <div style={{ margin: spaceStaticXxl, color: colorTextBodyDefault }}>
        <img
          style={{ margin: spaceStaticS }}
          src={lineSvg}
          alt='Line widget light icon'
        />
        <div>Drag and drop your widget in the canvas.</div>
      </div>
    </div>
  );
};

export default DashboardEmptyState;
