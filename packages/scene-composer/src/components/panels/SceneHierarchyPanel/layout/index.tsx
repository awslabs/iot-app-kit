import { type FC, type ReactNode } from 'react';
import './layout.scss';

interface LayoutProps {
  children: ReactNode;
}

interface MainProps {
  children: ReactNode;
}

interface ToolbarProps {
  children: ReactNode;
}

interface ActionBarProps {
  children: ReactNode;
}

const HierarchyPanelLayout: FC<LayoutProps> = ({ children }) => {
  return <div className='tm-hierarchy-panel'>{children}</div>;
};

export const Main: FC<MainProps> = ({ children }) => {
  return (
    <div id='tm-main' className='tm-main' role='radioGroup'>
      {children}
    </div>
  );
};

export const Toolbar: FC<ToolbarProps> = ({ children }) => {
  return <div className='tm-toolbar'>{children}</div>;
};

export const ActionBar: FC<ActionBarProps> = ({ children }) => {
  return <div className='tm-action-bar'>{children}</div>;
};

export default HierarchyPanelLayout;
