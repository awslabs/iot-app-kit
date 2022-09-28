import React, { FC } from 'react';
import './layout.scss';

interface LayoutProps {}

interface MainProps {
  todo?: string;
}

interface ToolbarProps {
  todo?: string;
}

interface ActionBarProps {
  todo?: string;
}

const HierarchyPanelLayout: FC<LayoutProps> = ({ children }) => {
  return <div className={'tm-hierarchy-panel'}>{children}</div>;
};

export const Main: FC<MainProps> = ({ todo, children }) => {
  return <div className={'tm-main'}>{children}</div>;
};

export const Toolbar: FC<ToolbarProps> = ({ todo, children }) => {
  return <div className={'tm-toolbar'}>{children}</div>;
};

export const ActionBar: FC<ActionBarProps> = ({ todo, children }) => {
  return <div className={'tm-action-bar'}>{children}</div>;
};

export default HierarchyPanelLayout;
