import React from 'react';

import './section.css';

const ContextMenuSection: React.FC = ({ children }) => {
  return <ul className="iot-context-menu-section">{children}</ul>;
};

export default ContextMenuSection;
