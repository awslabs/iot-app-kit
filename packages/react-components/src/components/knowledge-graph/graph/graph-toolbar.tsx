import { type ReactNode, type FC } from 'react';
import { STYLE_PREFIX } from './constants';

export interface ToolbarProps {
  children: ReactNode[];
}

const Toolbar: FC<ToolbarProps> = ({ children }) => {
  return (
    <ul className={`${STYLE_PREFIX}-controls`}>
      {children.map((child, index) => (
        <li key={index} className={`${STYLE_PREFIX}-control-item`}>
          {child}
        </li>
      ))}
    </ul>
  );
};

export default Toolbar;
