import { useCallback } from "react";
import { API } from 'aws-amplify';

const ApiName = 'AlarmDataGenerator';
const path = '/generate';

export interface TelemetryMetric {
  telemetryAssetId: string;
  telemetryAssetType: 'Mixer';
  metrics: {
    [key: string]: number | string;
  }
}

const useDataGenerator = () => {
  const postTelemetry = useCallback(async (metrics: TelemetryMetric | TelemetryMetric[]) => {
    API.post(ApiName, `${path}/telemetry`, {
      body: metrics
    });
  }, []);

  return {
    postTelemetry
  }
}

export default useDataGenerator;
