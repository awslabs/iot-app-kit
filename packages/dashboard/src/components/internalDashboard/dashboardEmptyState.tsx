import {
  colorBorderSegmentDefault,
  colorTextBodyDefault,
  spaceStaticS,
  spaceStaticXs,
  spaceStaticXxl,
  spaceStaticXxxl,
} from '@cloudscape-design/design-tokens';
import { default as lineSvg } from '~/plugins/xy-plot/line.svg';
import './dashboardEmptyState.css';
import { type CSSProperties } from 'react';

const containerStyles = {
  borderColor: colorBorderSegmentDefault,
  borderRadius: spaceStaticXs,
  padding: spaceStaticXxxl,
} satisfies CSSProperties;

const innerStyles = {
  margin: spaceStaticXxl,
  color: colorTextBodyDefault,
} satisfies CSSProperties;

const imgStyles = {
  margin: spaceStaticS,
} satisfies CSSProperties;

export const DashboardEmptyState = () => {
  return (
    <div
      data-testid='empty-state'
      className='dashboard-empty-state'
      style={containerStyles}
    >
      <div style={innerStyles}>
        <img
          style={imgStyles}
          src={lineSvg as unknown as string}
          alt='Line widget light icon'
        />

        <div>Drag and drop your widget in the canvas.</div>
      </div>
    </div>
  );
};
