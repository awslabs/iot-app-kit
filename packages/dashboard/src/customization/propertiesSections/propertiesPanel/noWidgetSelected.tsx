import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React from 'react';

import EmptyPanelSvg from './assets/emptyPanel.svg';

export function NoWidgetSelected() {
  return (
    <Box margin={{ top: 'xxxl' }}>
      <SpaceBetween direction='vertical' size='m' alignItems='center'>
        <Box variant='p' fontWeight='bold'>
          Select a widget to configure.
        </Box>

        <img src={EmptyPanelSvg} alt='Select a widget to configure.' />
      </SpaceBetween>
    </Box>
  );
}
