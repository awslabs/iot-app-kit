import React, { useRef, useState } from 'react';
import './tooltip.css';
import {
  colorBackgroundHomeHeader,
  colorBackgroundLayoutMain,
  spaceScaledM,
  spaceStaticS,
  spaceStaticXs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';
import { MAX_TOOLTIP_WIDTH, TOP_TOOLTIP_MARGIN, WRAPPED_TOOLTIP_WIDTH } from './constants';

export const Tooltip = ({
  content,
  position,
  children,
}: {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isContentWrapped, setIsContentWrapped] = useState(false);
  const tooltipStyle = {
    fontSize: spaceScaledM,
    color: colorBackgroundHomeHeader,
    backgroundColor: colorBackgroundLayoutMain,
    padding: spaceStaticS,
    borderRadius: spaceStaticXs,
    border: `${spaceStaticXxxs} solid ${colorBackgroundHomeHeader}`,
    maxWidth: `${MAX_TOOLTIP_WIDTH}px`,
    ...(isContentWrapped && { width: `${MAX_TOOLTIP_WIDTH}px` }),
    ...(isContentWrapped && position !== 'bottom' ? { bottom: `${TOP_TOOLTIP_MARGIN}%` } : ''),
  };

  const handleMouseEnter = () => {
    if (contentRef.current) {
      setIsContentWrapped(contentRef.current.clientWidth > WRAPPED_TOOLTIP_WIDTH);
    }
  };

  const handleMouseLeave = () => {
    setIsContentWrapped(false);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className='tooltip-container' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {content && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <span
          className={`tooltip-text ${position}`}
          style={{
            ...tooltipStyle,
            whiteSpace: !isContentWrapped ? 'nowrap' : 'pre-wrap',
          }}
          ref={contentRef}
          onClick={handleOnClick}
        >
          {content}
        </span>
      )}
    </div>
  );
};
