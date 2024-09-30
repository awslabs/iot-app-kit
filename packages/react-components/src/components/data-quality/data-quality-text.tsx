import React from 'react';
import { Quality } from '@aws-sdk/client-iotsitewise';
import Box from '@cloudscape-design/components/box';
import { spaceScaledXxs } from '@cloudscape-design/design-tokens';

import './data-quality-text.css';

type DataQualityTextOptions = {
  quality?: Quality;
  inheritFontColor?: boolean;
};

export const DataQualityText = ({
  quality,
  inheritFontColor,
}: DataQualityTextOptions) => {
  // Don't show any special UX for good quality points
  if (!quality || quality === 'GOOD') return null;

  let text = null;
  const styles: React.CSSProperties = {
    gap: spaceScaledXxs,
    textDecoration: 'none',
  };

  switch (quality) {
    case 'BAD':
      text = (
        <Box color={inheritFontColor ? 'inherit' : 'text-label'}>
          Bad Quality
        </Box>
      );
      break;
    case 'UNCERTAIN':
      text = (
        <Box color={inheritFontColor ? 'inherit' : 'text-label'}>
          Uncertain Quality
        </Box>
      );
      break;
  }

  return (
    <div data-testid='data-quality-text'>
      <div className='data-quality-text' style={styles}>
        {text}
      </div>
    </div>
  );
};
