import React from 'react';

import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';
import { Alert, Box } from '@cloudscape-design/components';
import useIntlStore, { getMessageKey } from '../../translations';

export const AnomalyWidgetError = () => {
  const intl = useIntlStore((state) => state.intl);

  return (
    <div
      className='kpi'
      data-testid='kpi-error-component'
      style={{
        background: colorBackgroundContainerContent,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
      }}
    >
      <Box margin={{ vertical: 's', horizontal: 's' }}>
        <Alert statusIconAriaLabel='Error' type='error'>
          {intl.formatMessage({
            id: getMessageKey('anomaly-widget.error'),
            description:
              'Error message if the anomaly widget fails to load data',
            defaultMessage: 'Error: failed to load anomaly results',
          })}
        </Alert>
      </Box>
    </div>
  );
};
