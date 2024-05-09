import { getSiteWiseClient } from '@iot-app-kit/core-util';
import { useViewport } from '../../src';
import { getEnvCredentials, getRegion } from '../utils/query';
import { useSiteWiseAnomalyDataSource } from '../../src/queries';
import React from 'react';
import { AnomalyChart } from '../../src/components/anomaly-chart';
import { AnomalyChartOptions } from '../../src/components/anomaly-chart/types';

export const ConnectedAnomalyChart = ({
  assetId,
  predictionDefinitionId,
  ...options
}: {
  assetId: string;
  predictionDefinitionId: string;
} & AnomalyChartOptions) => {
  const { viewport } = useViewport();

  const clientConfiguration = {
    awsCredentials: getEnvCredentials(),
    awsRegion: getRegion(),
  };
  const client = getSiteWiseClient(clientConfiguration);

  const datasource = useSiteWiseAnomalyDataSource({
    viewport,
    client,
    assetId,
    predictionDefinitionId,
  });

  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyChart {...options} datasources={[datasource]} />
      </div>
    </div>
  );
};
