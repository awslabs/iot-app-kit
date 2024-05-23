import React from 'react';

import {
  colorBackgroundContainerContent,
  colorTextStatusError,
} from '@cloudscape-design/design-tokens';
import { Icon } from '@cloudscape-design/components';
import useIntlStore from '../../translations';

export const AnomalyChartError = () => {
  const intl = useIntlStore((state) => state.intl);

  return (
    <div
      data-testid='anomaly-error-component'
      style={{
        background: colorBackgroundContainerContent,
        color: colorTextStatusError,
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        padding: '16px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
      }}
    >
      <Icon name='status-negative' />
      <div style={{ paddingLeft: '4px' }}>
        {intl.formatMessage({
          id: 'anomaly-chart.error',
          description: 'Error message if the anomaly widget fails to load data',
          defaultMessage: "The data couldn't be fetched. Try again later.",
        })}
      </div>
    </div>
  );
};
