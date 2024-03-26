import React, { useEffect, useState } from 'react';
import { useECharts } from '../../hooks/useECharts';
import { DEFAULT_L4E_WIDGET_SETTINGS } from './constants';
import { ContributingPropertiesTable } from './contributingPropertiesTable/contributingPropertiesTable';
import { AnomalyResult } from './types';
import { WidgetSettings } from '../../common/dataTypes';

export interface L4EWidgetProps {
  data: AnomalyResult[];
  widgetSettings?: WidgetSettings;
}

type SelectEvent = {
  fromAction: string;
  selected: { dataIndex: number[] }[];
};

export const L4EWidget = ({ data, widgetSettings }: L4EWidgetProps) => {
  const mappedEvents = data.map((ev) => [ev.value.timestamp, 100, ev.value]);
  const { ref, chartRef } = useECharts();
  const [selectedItems, setSelectedItems] = useState<AnomalyResult[]>([]);

  useEffect(() => {
    const l4e = chartRef.current;
    // set default chart options
    l4e?.setOption({ ...DEFAULT_L4E_WIDGET_SETTINGS });
    // set event handlers
    // @ts-expect-error TODO: Fix this
    l4e?.on('selectchanged', ({ fromAction, selected }: SelectEvent) => {
      if (fromAction === 'select' || !!selected.length) {
        const selectedIndices = selected[0].dataIndex;
        setSelectedItems(selectedIndices.map((i: number) => data[i]));
      } else {
        setSelectedItems([]);
      }
    });
  }, [chartRef, data]);

  // set dataSet
  useEffect(() => {
    chartRef.current?.setOption({
      dataset: {
        dimensions: ['time', 'value', 'extraData'],
        source: mappedEvents,
      },
    });
  }, [chartRef, mappedEvents]);

  return (
    <div style={{ background: 'white', width: '1000px', height: '600px' }}>
      <div
        ref={ref}
        style={{ width: '100%', height: '200px', paddingBottom: '32px' }}
      />
      <ContributingPropertiesTable
        significantDigits={widgetSettings?.significantDigits}
        data={selectedItems}
      />
    </div>
  );
};
