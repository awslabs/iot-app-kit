import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';
import { memo } from 'react';
import './no-chart-data.css';

export interface NoChartDataProps {
  icon: string;
  text: string;
}

export const NoChartData = memo(({ icon, text }: NoChartDataProps) => {
  return (
    <div
      aria-description='empty widget tile'
      className='no-chart-data-empty-state'
      style={{
        backgroundColor: colorBackgroundContainerContent,
      }}
    >
      <Box textAlign='center'>
        <SpaceBetween size='xxs'>
          <img height={50} width={50} src={icon} alt='empty widget icon' />
          <Box color='text-label' variant='p' fontWeight='bold'>
            {text}
          </Box>
        </SpaceBetween>
      </Box>
    </div>
  );
});
