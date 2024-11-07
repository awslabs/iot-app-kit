import { useViewport } from '../../src';
import { getIotSiteWiseQuery } from '../utils/query';
import { AnomalyChart } from '../../src/components/anomaly-chart';
import { type AnomalyChartOptions } from '../../src/components/anomaly-chart/types';

export const ConnectedAnomalyChart = ({
  assetId,
  predictionDefinitionId,
  ...options
}: {
  assetId: string;
  predictionDefinitionId: string;
} & AnomalyChartOptions) => {
  const { viewport } = useViewport();

  const query = getIotSiteWiseQuery();
  const anomalyQuery = query.anomalyData({ assetId, predictionDefinitionId });

  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyChart {...options} query={anomalyQuery} viewport={viewport} />
      </div>
    </div>
  );
};
