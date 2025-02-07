import { colorBorderDividerDefault } from '@cloudscape-design/design-tokens';
import { type CSSProperties } from 'react';
import './horizontal-divider.css';

export interface HorizontalDividerProps {
  styles?: CSSProperties;
  classNames?: string[];
}

export const HorizontalDivider = ({
  styles,
  classNames = [],
}: HorizontalDividerProps) => (
  <div
    className={['horizontal-divider', ...classNames].join(' ')}
    style={{ backgroundColor: colorBorderDividerDefault, ...styles }}
  ></div>
);
