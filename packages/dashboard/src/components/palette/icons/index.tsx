import React, { type DragEventHandler } from 'react';
import Box from '@cloudscape-design/components/box';
import {
  colorBackgroundHomeHeader,
  colorBackgroundLayoutMain,
  colorBorderButtonNormalDisabled,
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
  const tooltipStyle = {
    fontSize: spaceScaledM,
    color: colorBackgroundHomeHeader,
    backgroundColor: colorBackgroundLayoutMain,
    padding: `${spaceScaledS} ${spaceScaledM}`,
    borderRadius: spaceStaticXs,
    borderWidth: spaceScaledXxxs,
    borderColor: colorBorderButtonNormalDisabled,
    boxShadow: `${spaceScaledXxxs} ${spaceScaledXxxs} ${spaceScaledXxxs} ${colorBorderButtonNormalDisabled}`,
  };

  // Without this, Firefox widget drag and drop does not work correctly.
  const ignoreDragStart: DragEventHandler = (event) => event.preventDefault();

  return (
    <span onDragStart={ignoreDragStart}>
      <Box padding='xxs' className='palette-component-icon ripple'>
        <Icon />
        <span className='tooltiptext' style={tooltipStyle}>
          {widgetName}
        </span>
      </Box>
    </span>
  );
};

export default PaletteComponentIcon;
