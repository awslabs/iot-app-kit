import React from 'react';

import { Box, SpaceBetween } from '@cloudscape-design/components';
import { colorTextLayoutToggle } from '@cloudscape-design/design-tokens';

import './no-chart-data.css';

interface NoChartDataProps {
  icon: string;
  emptyStateText: string;
}

const NoChartData = ({ icon, emptyStateText }: NoChartDataProps) => {
  return (
    <div
      aria-description='empty widget tile'
      className='no-chart-data-empty-state'
      style={{
        backgroundColor: colorTextLayoutToggle,
      }}
    >
      <Box textAlign='center'>
        <SpaceBetween size='xxs'>
          <img height={50} width={50} src={icon} alt='empty widget icon' />
          <Box color='text-label' variant='p' fontWeight='bold'>
            {emptyStateText}
          </Box>
        </SpaceBetween>
      </Box>
    </div>
  );
};

export default NoChartData;
