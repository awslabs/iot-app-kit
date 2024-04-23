import React, { type DragEventHandler } from 'react';
import Box from '@cloudscape-design/components/box';
import './index.css';
import { Tooltip } from '../../../../../react-components/src';

type PaletteComponentIconProps = {
  Icon: React.FC;
  widgetName: string;
};
const PaletteComponentIcon: React.FC<PaletteComponentIconProps> = ({
  Icon,
  widgetName,
}) => {
  // Without this, Firefox widget drag and drop does not work correctly.
  const ignoreDragStart: DragEventHandler = (event) => event.preventDefault();

  return (
    <span onDragStart={ignoreDragStart}>
      <Tooltip content={widgetName} position='bottom' widgetTooltip={true}>
        <Box padding='xxs' className='palette-component-icon ripple'>
          <Icon />
        </Box>
      </Tooltip>
    </span>
  );
};

export default PaletteComponentIcon;
