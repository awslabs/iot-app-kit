import { colorBorderDividerDefault } from '@cloudscape-design/design-tokens';
import './horizontalDivider.css';

export const HorizontalDivider = ({
  styles,
  classNames = [],
}: {
  styles?: React.CSSProperties;
  classNames?: string[];
}) => (
  <div
    className={['horizontal-divider', ...classNames].join(' ')}
    style={{ backgroundColor: colorBorderDividerDefault, ...styles }}
  ></div>
);
