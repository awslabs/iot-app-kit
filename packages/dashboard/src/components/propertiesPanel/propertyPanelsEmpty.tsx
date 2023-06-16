import Box from '@cloudscape-design/components/box';
import React from 'react';

const PROPERTIES_PANEL_EMPTY_STYLE = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

/** Empty state for the properties panel. */
export function PropertiesPanelEmpty() {
  return (
    <div style={PROPERTIES_PANEL_EMPTY_STYLE}>
      <Box margin='m' variant='p' color='text-status-inactive'>
        Select widgets to configure.
      </Box>
    </div>
  );
}
