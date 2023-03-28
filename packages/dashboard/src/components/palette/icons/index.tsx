import React from 'react';
import Box from '@cloudscape-design/components/box';

import './index.css';

type PaletteComponentIconProps = {
  Icon: React.FC;
};

const PaletteComponentIcon: React.FC<PaletteComponentIconProps> = ({ Icon }) => {
  return (
    <Box padding='xs' className='palette-component-icon'>
      <Icon />
    </Box>
  );
};

export default PaletteComponentIcon;
