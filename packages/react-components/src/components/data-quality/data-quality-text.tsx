import React from 'react';
import { Quality } from '@aws-sdk/client-iotsitewise';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import {
  spaceScaledXxs,
  colorBackgroundStatusError,
  colorBackgroundStatusWarning,
  borderRadiusBadge,
  colorBorderStatusError,
  colorBorderStatusWarning,
  spaceScaledXs,
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
    padding: `${spaceScaledXxs} ${spaceScaledXs}`,
    border: '1px solid',
    borderRadius: borderRadiusBadge,
    gap: spaceScaledXxs,
  };

  switch (quality) {
    case 'BAD':
      icon = <Icon name='status-negative' variant='error' />;
      text = <Box color='text-status-error'>Bad Quality</Box>;
      styles = {
        ...styles,
        borderColor: colorBorderStatusError,
        backgroundColor: colorBackgroundStatusError,
      };
      break;
    case 'UNCERTAIN':
      icon = <Icon name='status-warning' variant='warning' />;
      text = <Box color='text-status-warning'>Uncertain Quality</Box>;
      styles = {
        ...styles,
        borderColor: colorBorderStatusWarning,
        backgroundColor: colorBackgroundStatusWarning,
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
