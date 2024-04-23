import React, { useEffect, useRef, useState } from 'react';
import {
  colorTextBodyDefault,
  spaceScaledM,
  spaceStaticS,
  spaceStaticXs,
  colorBackgroundContainerContent,
  colorBorderControlDefault,
  colorBorderButtonNormalDisabled,
} from '@cloudscape-design/design-tokens';
import {
  MAX_TOOLTIP_WIDTH,
  TOP_TOOLTIP_MARGIN,
  WRAPPED_TOOLTIP_WIDTH,
} from './constants';
import styled, { css } from 'styled-components';

export const Tooltip = ({
  content,
  position,
  children,
  widgetTooltip,
}: {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  widgetTooltip?: boolean;
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isContentWrapped, setIsContentWrapped] = useState(false);
  const [hover, setHover] = useState<boolean>(false);
  const tooltipStyle = {
    fontSize: spaceScaledM,
    color: colorTextBodyDefault,
    backgroundColor: colorBackgroundContainerContent,
    padding: spaceStaticS,
    borderRadius: spaceStaticXs,
    border: `1px solid ${colorBorderControlDefault}`,
    maxWidth: `${MAX_TOOLTIP_WIDTH}px`,
    ...(isContentWrapped && { width: `${MAX_TOOLTIP_WIDTH}px` }),
    ...(isContentWrapped && position !== 'bottom'
      ? { bottom: `${TOP_TOOLTIP_MARGIN}%` }
      : ''),
  };

  const handleMouseEnter = () => {
    setHover(true);
    if (contentRef.current) {
      setIsContentWrapped(
        contentRef.current.clientWidth > WRAPPED_TOOLTIP_WIDTH
      );
    }
  };

  const handleMouseLeave = () => {
    setHover(false);
    setIsContentWrapped(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && hover) {
        event.stopPropagation();
        setHover(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [hover]);

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  interface TooltipProps {
    hover: boolean;
    position: 'bottom' | 'top' | 'right' | 'left';
    widgetTooltip?: boolean;
  }

  const tooltipPositionStyles = {
    top: css`
      bottom: -30%;
      left: 50%;
      transform: translateX(-50%) translateY(-100%);
    `,
    bottom: css`
      top: ${widgetTooltip ? '85%' : '110%'};
      left: 50%;
      transform: translateX(-50%) translateY(12px);
    `,
    left: css`
      top: 50%;
      left: 10%;
      transform: translateX(-100%) translateY(-50%);
    `,
    right: css`
      top: 50%;
      left: 90%;
      transform: translateX(0) translateY(-50%);
    `,
  };

  const TooltipContainer = styled.span`
    position: relative;
    display: inline-block;
  `;

  const TooltipText = styled.span<TooltipProps>`
    position: absolute;
    z-index: 99;
    text-align: center;
    ${({ widgetTooltip }) =>
      widgetTooltip &&
      css`
        box-shadow: 2px 2px 2px ${colorBorderButtonNormalDisabled};
      `};
    ${({ position }) => tooltipPositionStyles[position]}

    &::before,
    &::after {
      content: '';
      position: absolute;
    }
    &::before {
      width: 0;
      height: 0;
      border: 6px solid transparent;
    }

    ${({ position }) =>
      position === 'top' &&
      css`
        &::after,
        &::before {
          top: 100%;
          left: 50%;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
        }
        &::before {
          border-top: 12px solid ${colorBorderControlDefault};
        }
        &::after {
          border-top: 13px solid ${colorBackgroundContainerContent};
          margin-top: -2px;
          z-index: 1;
        }
      `}

    ${({ position, widgetTooltip }) =>
      position === 'bottom' &&
      css`
        &::after,
        &::before {
          bottom: ${widgetTooltip ? 101 : 100}%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
        }
        &::before {
          border-bottom: 12px solid ${colorBorderControlDefault};
        }
        &::after {
          border-bottom: 12px solid ${colorBackgroundContainerContent};
          margin-bottom: -2px;
          z-index: 1;
        }
      `}
  
      ${({ position }) =>
      position === 'left' &&
      css`
        &::after,
        &::before {
          top: 50%;
          left: 100%;
          transform: translateY(-50%);
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
        }
        &::before {
          border-left: 12px solid ${colorBorderControlDefault};
        }
        &::after {
          border-left: 12px solid ${colorBackgroundContainerContent};
          margin-left: -2px;
          z-index: 1;
        }
      `}

      ${({ position }) =>
      position === 'right' &&
      css`
        &::after,
        &::before {
          top: 50%;
          right: 100%;
          transform: translateY(-50%);
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
        }
        &::before {
          border-right: 10px solid ${colorBorderControlDefault};
        }
        &::after {
          border-right: 11px solid ${colorBackgroundContainerContent};
          margin-right: -2px;
          z-index: 1;
        }
      `}
  `;

  return (
    <TooltipContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {content && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <TooltipText
          hover={hover}
          position={position}
          widgetTooltip={widgetTooltip}
          style={{
            visibility: `${hover ? 'visible' : 'hidden'}`,
            ...tooltipStyle,
            whiteSpace: !isContentWrapped ? 'nowrap' : 'pre-wrap',
          }}
          ref={contentRef}
          onClick={handleOnClick}
        >
          {content}
        </TooltipText>
      )}
    </TooltipContainer>
  );
};
