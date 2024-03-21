import React, { useState, type DragEventHandler, useEffect } from 'react';
import Box from '@cloudscape-design/components/box';
import {
  colorBackgroundLayoutMain,
  colorBorderButtonNormalDisabled,
  colorTextButtonNormalActive,
  spaceScaledS,
  spaceScaledM,
  spaceStaticXs,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import './index.css';

type PaletteComponentIconProps = {
  Icon: React.FC;
  widgetName: string;
};
const PaletteComponentIcon: React.FC<PaletteComponentIconProps> = ({
  Icon,
  widgetName,
}) => {
  const [hover, setHover] = useState<boolean>(false);

  const tooltipStyle = {
    fontSize: spaceScaledM,
    color: colorTextButtonNormalActive,
    backgroundColor: colorBackgroundLayoutMain,
    padding: `${spaceScaledS} ${spaceScaledM}`,
    borderRadius: spaceStaticXs,
    borderWidth: spaceScaledXxxs,
    borderColor: colorBorderButtonNormalDisabled,
    boxShadow: `${spaceScaledXxxs} ${spaceScaledXxxs} ${spaceScaledXxxs} ${colorBorderButtonNormalDisabled}`,
  };

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
        <span
          className='tooltiptext'
          style={{
            ...tooltipStyle,
            visibility: `${hover ? 'visible' : 'hidden'}`,
          }}
        >
          {widgetName}
        </span>
      </Box>
    </span>
  );
};

export default PaletteComponentIcon;
