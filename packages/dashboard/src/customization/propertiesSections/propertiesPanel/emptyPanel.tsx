import Box from '@cloudscape-design/components/box';
import React from 'react';
import EmptyPanelSvg from './assets/emptyPanel.svg';
import { SpaceBetween } from '@cloudscape-design/components';
import './emptyPanel.css';

/** Empty state for the properties panel. */
export function PropertiesPanelEmpty() {
  return (
    <div className='empty-panel'>
      <SpaceBetween direction='vertical' size='xl'>
        <Box textAlign='center' variant='p' fontWeight='bold'>
          Select a widget to configure.
        </Box>
        <Box textAlign='center'>
          <img src={EmptyPanelSvg} alt={EmptyPanelSvg} />
        </Box>
      </SpaceBetween>
    </div>
  );
}
