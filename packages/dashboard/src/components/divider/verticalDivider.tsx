import React from 'react';

import { colorBorderDividerDefault } from '@cloudscape-design/design-tokens';

import './verticalDivider.css';

export const VerticalDivider = ({
  styles,
  classNames = [],
}: {
  styles?: React.CSSProperties;
  classNames?: string[];
}) => (
  <div
    className={['vertical-divider', ...classNames].join(' ')}
    style={{ backgroundColor: colorBorderDividerDefault, ...styles }}
  ></div>
);
