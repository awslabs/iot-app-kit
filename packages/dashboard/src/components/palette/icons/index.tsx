import React from 'react';

import './index.css';

type PaletteComponentIconProps = {
  Icon: React.FC;
};

const PaletteComponentIcon: React.FC<PaletteComponentIconProps> = ({ Icon }) => {
  return <Icon />;
};

export default PaletteComponentIcon;
