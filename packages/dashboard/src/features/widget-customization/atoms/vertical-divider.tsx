import { colorBorderDividerDefault } from '@cloudscape-design/design-tokens';
import { type CSSProperties } from 'react';
import './vertical-divider.css';

export interface VerticalDividerProps {
  styles?: CSSProperties;
  classNames?: string[];
}

export const VerticalDivider = ({
  styles,
  classNames = [],
}: VerticalDividerProps) => (
  <div
    className={['vertical-divider', ...classNames].join(' ')}
    style={{ backgroundColor: colorBorderDividerDefault, ...styles }}
  ></div>
);
