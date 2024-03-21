import { getSiteWiseClient } from '@iot-app-kit/core-util';
import { useViewport } from '../../src';
import { getEnvCredentials, getRegion } from '../utils/query';
import { useSiteWiseAnomalyDataSource } from '../../src/queries';
import React from 'react';
import { AnomalyWidget } from '../../src/components/anomaly-widget';
import { AnomalyWidgetOptions } from '../../src/components/anomaly-widget/types';

export const ConnectedAnomalyWidget = ({
  assetId,
  predictionDefinitionId,
  ...options
}: {
  assetId: string;
  predictionDefinitionId: string;
} & AnomalyWidgetOptions) => {
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
        <AnomalyWidget {...options} datasources={[datasource]} />
      </div>
    </div>
  );
};
