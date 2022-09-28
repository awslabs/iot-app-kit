import React, { FC } from 'react';

import { Arrow } from '../../../../assets/auto-gen/icons';

import './PreviewArrow.scss';

interface PreviewArrowProps {
  color?: string;
  background?: string;
  opacity: number;
}

const PreviewArrow: FC<PreviewArrowProps> = ({ background, color, opacity }) => {
  return (
    <div className={'tm-preview-arrow'} style={{ color, background, opacity }}>
      <Arrow viewBox={'0 0 41 41'} />
    </div>
  );
};

PreviewArrow.displayName = 'PreviewArrow';

export default PreviewArrow;
