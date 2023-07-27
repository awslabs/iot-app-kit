import React from 'react';

import Box from '@cloudscape-design/components/box';

import { YAxisLegend } from './yAxisMenu';
import { YAxisLegendOption } from '../converters/defaultConvertedDataStream';

import './multiYAxis.css'

export const MultiYAxisLegend = ({ yMax, yMin }: { yMax: YAxisLegendOption[], yMin: YAxisLegendOption[] }) => {

  return (
    <Box padding={{ right: 's' }}>
      <div className='multi-y-axis-legend'>
        <YAxisLegend label={'Y-Min'} axes={yMin} />
        <YAxisLegend label={'Y-Max'} axes={yMax} menuPosition='top' />
      </div>
    </Box>
  );
};
