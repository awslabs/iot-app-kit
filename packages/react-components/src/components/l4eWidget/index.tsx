import React, { useEffect } from 'react';
import { useECharts } from '../../hooks/useECharts';
import { DEFAULT_L4E_WIDGET_SETTINGS } from './constants';
import { MockData } from './fakeData';

export const L4EWidget = () => {
  const { ref, chartRef } = useECharts();

  useEffect(() => {
    const l4e = chartRef.current;
    l4e?.setOption(DEFAULT_L4E_WIDGET_SETTINGS);
  }, [chartRef]);

  return (
    <div style={{ background: 'grey' }}>
      <div
        ref={ref}
        style={{ background: 'white', width: '1000px', height: '300px' }}
      />
      <div
        style={{
          background: 'lightGrey',
          width: '1000px',
          height: '500px',
          overflow: 'scroll',
        }}
      >
        <pre>{JSON.stringify(MockData, null, 2)}</pre>
      </div>
    </div>
  );
};
