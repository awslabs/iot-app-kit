// eslint-disable-next-line import/default
import React from 'react';
import { Box, Icon } from '@cloudscape-design/components';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';

export const GaugeErrorText = ({ error }: { error?: string }) => {
  if (!error) {
    return null;
  }
  return (
    <div className='gauge-data-quality'>
      <div
        className='gauge-info-text'
        style={{
          gap: spaceScaledXs,
        }}
      >
        <Icon name='status-warning' variant='warning' />
        <Box variant='span'>{error}</Box>
      </div>
    </div>
  );
};
