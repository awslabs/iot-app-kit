import React from 'react';

import {
  colorBackgroundContainerContent,
  colorTextEmpty,
} from '@cloudscape-design/design-tokens';
import useIntlStore from '../../translations';

export const AnomalyChartEmpty = () => {
  const intl = useIntlStore((state) => state.intl);

  return (
    <div
      data-testid='anomaly-empty-component'
      style={{
        background: colorBackgroundContainerContent,
        color: colorTextEmpty,
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
      }}
    >
      <b>
        {intl.formatMessage({
          id: 'anomaly-chart.empty',
          description:
            'Empty message if the anomaly widget does not have a query or data to render.',
          defaultMessage: 'No data available',
        })}
      </b>
      <div style={{ paddingTop: '8px' }}>
        {intl.formatMessage({
          id: 'anomaly-chart.empty-subtitle',
          description:
            'Empty message if the anomaly widget does not have a query or data to render.',
          defaultMessage: 'There is no data available',
        })}
      </div>
    </div>
  );
};
