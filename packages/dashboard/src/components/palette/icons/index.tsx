import React from 'react';
import Box from '@cloudscape-design/components/box';

import * as awsui from '@cloudscape-design/design-tokens';
import './index.css';

type PaletteComponentIconProps = {
  Icon: React.FC;
  widgetName: String;
};
const PaletteComponentIcon: React.FC<PaletteComponentIconProps> = ({ Icon, widgetName }) => {
  const tooltipStyle = {
    color: awsui.colorBackgroundLayoutMain,
    backgroundColor: awsui.colorBackgroundHomeHeader,
  };
  return (
    <Box padding='xxs' className='palette-component-icon'>
        <Icon />
       <span className="tooltiptext" style={tooltipStyle}>{widgetName}</span>
    </Box>
  );
};

export default PaletteComponentIcon;
