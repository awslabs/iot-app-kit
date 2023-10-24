import { FC, useMemo } from 'react';
import { LineChart as LineChartAppKit, WebglContext } from '@iot-app-kit/react-components';
import { useViewport } from "@iot-app-kit/react-components";

import { dataSource } from '../dataSource';
import './LineChart.scss';

interface LineChartProps {
  entityId: string,
}

const LineChart: FC<LineChartProps> = ({ entityId }) => {
  const { viewport } = useViewport();

  const queries = useMemo(() =>{
    const entityQuery = {
      entityId: entityId,
      componentName: 'MixerComponent',
      properties: [{ propertyName: 'RPM' }],
    }
    console.log('entityQuery: ', entityQuery);
    return [dataSource.query.timeSeriesData(entityQuery)];
  }, [entityId, dataSource]);

  return (
    <div className='LineChart'>
      <LineChartAppKit queries={queries} viewport={viewport} yMin={0} axis={{yAxisLabel: 'RPM'}}/>
      <WebglContext />
    </div>
  )
};

export default LineChart;
