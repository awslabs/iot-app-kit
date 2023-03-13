import React from 'react';

import './section.css';
import type { ReactNode } from 'react';

interface ContextMenuSectionProps {
  children: ReactNode;
}

const ContextMenuSection: React.FC<ContextMenuSectionProps> = ({ children }) => {
  return <ul className='iot-context-menu-section'>{children}</ul>;
};

export default ContextMenuSection;
