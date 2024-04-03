import React from 'react';
import { useECharts } from '../../hooks/useECharts';
import { AnomalyResult } from './types';
import { useSetOptions } from './hooks/useSetOptions';
import { useXAxis } from './hooks/useXAxis';
import { useTitle } from './hooks/useTitle';
import { useDataSet } from './hooks/useDataSet';
import { useSeries } from './hooks/useSeries';
import { useTooltip } from './hooks/useTooltip';

export interface L4EWidgetProps {
  // data: [some generic data type]; //// this will need its own doc to create a flexible data type
  data: AnomalyResult[]; // placeholder data type
  mode?: 'light' | 'dark'; // sets the theme of the widget
  decimalPlaces?: number; // sets the number of decimal places values will be rounded to
  title?: string; // title for the widget, can be used to display the prediction model name
  // if no start / end is provided, start / end will be determined from the data
  viewportStart?: Date;
  viewportEnd?: Date;
  tooltipSort?: 'value' | 'alphabetical';
}

export const L4EWidget = ({
  data,
  title,
  decimalPlaces,
  viewportStart,
  viewportEnd,
  tooltipSort,
}: L4EWidgetProps) => {
  const { ref, chartRef } = useECharts();

  const customXAxis = useXAxis({ viewportStart, viewportEnd });
  const customTitle = useTitle({ title });
  const customDataSet = useDataSet({ data });
  const customSeries = useSeries({ data });
  const customTooltip = useTooltip({ decimalPlaces, tooltipSort });

  const customOptions = {
    ...customXAxis,
    ...customTitle,
    ...customDataSet,
    ...customSeries,
    ...customTooltip,
  };

  useSetOptions({ chartRef, customOptions });

  return (
    <div style={{ background: 'white', width: '100%', height: '100%' }}>
      <div
        ref={ref}
        style={{ width: '100%', height: '100%', paddingBottom: '32px' }}
      />
    </div>
  );
};
