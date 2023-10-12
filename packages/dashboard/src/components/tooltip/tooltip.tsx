import React from 'react';
import './tooltip.css';
import {
  colorBackgroundHomeHeader,
  colorBackgroundLayoutMain,
  spaceScaledM,
  spaceStaticS,
  spaceStaticXs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';

const Tooltip = ({
  content,
  position,
  children,
}: {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}) => {
  const tooltipStyle = {
    fontSize: spaceScaledM,
    color: colorBackgroundHomeHeader,
    backgroundColor: colorBackgroundLayoutMain,
    padding: spaceStaticS,
    borderRadius: spaceStaticXs,
    border: `${spaceStaticXxxs} solid ${colorBackgroundHomeHeader}`,
  };

  return (
    <div className='tooltip-container'>
      {children}
      <div className={`tooltip-text ${position}`} style={tooltipStyle}>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
