// eslint-disable-next-line import/default
import React from 'react';
import { Box, Icon, SpaceBetween } from '@cloudscape-design/components';

export const GaugeErrorText = ({ error }: { error?: string }) => {
  if (!error) {
    return null;
  }
  return (
    <SpaceBetween direction='horizontal' size='xs'>
      <Icon name='status-negative' variant='error' />
      <Box variant='span'>{error}</Box>
    </SpaceBetween>
  );
};
