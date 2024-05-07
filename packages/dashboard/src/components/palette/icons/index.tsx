import React, { useState, type DragEventHandler, useEffect } from 'react';
import Box from '@cloudscape-design/components/box';
import {
  colorBorderButtonNormalDisabled,
  colorBackgroundSegmentHover,
  borderRadiusPopover,
  fontSizeHeadingS,
  spaceStaticM,
  spaceStaticS,
  colorTextBodyDefault,
} from '@cloudscape-design/design-tokens';
import './index.css';
import styled from 'styled-components';

type PaletteComponentIconProps = {
  Icon: React.FC;
  widgetName: string;
};

const Tooltip = styled.div<{ hover: boolean }>`
  ${({ hover }) => `visibility: ${hover ? 'visible' : 'hidden'};`}
  font-size: ${fontSizeHeadingS};
  color: ${colorTextBodyDefault};
  background-color: ${colorBackgroundSegmentHover};
  padding: ${spaceStaticS} ${spaceStaticM};
  border-radius: ${borderRadiusPopover};
  border-width: 2px;
  border-color: ${colorBorderButtonNormalDisabled};
  box-shadow: 2px 2px 2px ${colorBorderButtonNormalDisabled};
  position: absolute;
  left: 50%;
  top: 105%;
  border-style: solid;
  z-index: 9;
  transform: translateX(-50%);
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    left: 50%;
    right: 50%;
    margin: auto;
    margin-left: -10px;
    transform: rotate(180deg);
  }
  &::before {
    bottom: 92%;
    border-top: 11px solid ${colorBorderButtonNormalDisabled};
    margin-bottom: 5px;
  }
  &::after {
    bottom: 100%;
    border-top: 10px solid ${colorBackgroundSegmentHover};
    margin-top: -2px;
    z-index: 1;
  }
`;
const PaletteComponentIcon: React.FC<PaletteComponentIconProps> = ({
  Icon,
  widgetName,
}) => {
  const [hover, setHover] = useState<boolean>(false);

  // Without this, Firefox widget drag and drop does not work correctly.
  const ignoreDragStart: DragEventHandler = (event) => event.preventDefault();

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      setHover(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <span
      onDragStart={ignoreDragStart}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <Box padding='xxs' className='palette-component-icon ripple'>
        <Icon />
        <Tooltip {...{ hover }}>{widgetName}</Tooltip>
      </Box>
    </span>
  );
};

export default PaletteComponentIcon;
