import { FC, useMemo } from 'react';
import { Chart } from '@iot-app-kit/react-components';
import { useViewport } from "@iot-app-kit/react-components";

import { dataSource } from '../dataSource';
import './LineChart.scss';

interface LineChartProps {
  entityId: string,
}

const LineChart: FC<LineChartProps> = ({ entityId }) => {
  const { viewport } = useViewport();

  const queries = useMemo(() =>{
    const rpmQuery = {
      entityId: entityId,
      componentName: 'MixerComponent',
      properties: [{ propertyName: 'RPM' }],
    }
    const tempQuery = {
      entityId: entityId,
      componentName: 'MixerComponent',
      properties: [{ propertyName: 'Temperature' }],
    }
    return [dataSource.query.timeSeriesData(rpmQuery), dataSource.query.timeSeriesData(tempQuery)];
  }, [entityId, dataSource]);

  return (
    <div className='LineChart'>
      <Chart
        queries={queries}
        viewport={viewport}
        axis={{}}
        size={{width: 800, height: 500}}
        legend={{}}
        defaultVisualizationType={'line'}
        significantDigits={2}
      />
    </div>
  )
};

export default LineChart;
