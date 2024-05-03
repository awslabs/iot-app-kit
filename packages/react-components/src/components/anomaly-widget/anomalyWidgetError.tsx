import React from 'react';

import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';
import { Alert, Box } from '@cloudscape-design/components';

export const AnomalyWidgetError = () => {
  return (
    <div
      className='kpi'
      data-testid='kpi-error-component'
      style={{
        background: colorBackgroundContainerContent,
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Box margin={{ vertical: 's', horizontal: 's' }}>
        <Alert statusIconAriaLabel='Error' type='error'>
          Error: failed to load the requested data
        </Alert>
      </Box>
    </div>
  );
};
