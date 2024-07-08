import React from 'react';
import { Quality } from '@aws-sdk/client-iotsitewise';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import {
  colorBorderStatusError,
  colorBorderStatusWarning,
  spaceScaledXxs,
} from '@cloudscape-design/design-tokens';

import './data-quality-text.css';

type DataQualityTextOptions = {
  quality?: Quality;
};

export const DataQualityText = ({ quality }: DataQualityTextOptions) => {
  // Don't show any special UX for good quality points
  if (!quality || quality === 'GOOD') return null;

  let icon = null;
  let text = null;
  let styles: React.CSSProperties = {
    gap: spaceScaledXxs,
    textDecoration: 'none',
  };

  let borderBottom = '1px dashed ';

  switch (quality) {
    case 'BAD':
      icon = <Icon name='status-negative' variant='error' />;
      text = <Box color='text-status-error'>Bad Quality</Box>;
      borderBottom += colorBorderStatusError;
      styles = {
        ...styles,
        borderBottom: borderBottom,
      };
      break;
    case 'UNCERTAIN':
      icon = <Icon name='status-warning' variant='warning' />;
      text = <Box color='text-status-warning'>Uncertain Quality</Box>;
      borderBottom += colorBorderStatusWarning;
      styles = {
        ...styles,
        borderBottom: borderBottom,
      };
      break;
  }

  return (
    <div
      data-testid='data-quality-text'
      className='data-quality data-quality-text'
    >
      <div className='data-quality-text' style={styles}>
        {icon}
        {text}
      </div>
    </div>
  );
};
