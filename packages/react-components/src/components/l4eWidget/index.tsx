import React, { useEffect, useState } from 'react';
import { useECharts } from '../../hooks/useECharts';
import { DEFAULT_L4E_WIDGET_SETTINGS } from './constants';
import { ContributingPropertiesTable } from './contributingPropertiesTable/contributingPropertiesTable';
import { AnomalyResult } from './types';
import { useSetXAxis } from './hooks/useSetXAxis';
import { useSetTitle } from './hooks/useSetTitle';
import { useSetDataSet } from './hooks/useSetDataSet';

export interface L4EWidgetProps {
  // data: [some generic data type]; //// this will need its own doc to create a flexible data type
  data: AnomalyResult[]; // placeholder data type
  mode?: 'light' | 'dark'; // sets the theme of the widget
  decimalPlaces?: number; // sets the number of decimal places values will be rounded to
  title?: string; // title for the widget, can be used to display the prediction model name
  // if no start / end is provided, start / end will be determined from the data
  viewportStart?: Date;
  viewportEnd?: Date;
}

type SelectEvent = {
  fromAction: string;
  selected: { dataIndex: number[] }[];
};

export const L4EWidget = ({
  data,
  title,
  viewportStart,
  viewportEnd,
  decimalPlaces,
}: L4EWidgetProps) => {
  const { ref, chartRef } = useECharts();
  const [selectedItems, setSelectedItems] = useState<AnomalyResult[]>([]);

  useEffect(() => {
    const l4e = chartRef.current;
    // set default chart options
    l4e?.setOption({ ...DEFAULT_L4E_WIDGET_SETTINGS });
    // set event handlers

    // @ts-expect-error TODO: Fix this SelectedEvent type
    l4e?.on('selectchanged', ({ fromAction, selected }: SelectEvent) => {
      if (fromAction === 'select' || !!selected.length) {
        const selectedIndices = selected[0].dataIndex;
        setSelectedItems(selectedIndices.map((i: number) => data[i]));
      } else {
        setSelectedItems([]);
      }
    });
  }, [chartRef, data]);

  useSetXAxis({ chartRef, viewportStart, viewportEnd });
  useSetTitle({ chartRef, title });
  useSetDataSet({ chartRef, data });

  return (
    <div style={{ background: 'white', width: '1000px', height: '600px' }}>
      <div
        ref={ref}
        style={{ width: '100%', height: '200px', paddingBottom: '32px' }}
      />
      <ContributingPropertiesTable
        decimalPlaces={decimalPlaces}
        data={selectedItems}
      />
    </div>
  );
};
