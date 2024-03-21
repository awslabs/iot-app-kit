import { DescribeAssetModelCompositeModelCommandOutput } from '@aws-sdk/client-iotsitewise';

const ANOMALY_RESULT_NAME = 'AWS/L4E_ANOMALY_RESULT';

export const getAnomalyResultProperty = (
  anomalyCompositeModel:
    | DescribeAssetModelCompositeModelCommandOutput
    | undefined
) =>
  anomalyCompositeModel?.assetModelCompositeModelProperties?.find(
    ({ name }) => name === ANOMALY_RESULT_NAME
  );
