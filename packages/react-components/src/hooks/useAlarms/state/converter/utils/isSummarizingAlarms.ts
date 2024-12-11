import { compact } from '@iot-app-kit/helpers';
import { type AlarmRequest } from '../../../types';
import { type AlarmRequestState } from '../../types';

export const isSummarizingAlarms = ({
  describeAssetQueryStatus,
  describeAssetModelQueryStatus,
}: AlarmRequestState<AlarmRequest>) => {
  if (describeAssetQueryStatus == null && describeAssetModelQueryStatus == null)
    return true;

  const successStatuses = compact([
    describeAssetQueryStatus?.isSuccess,
    describeAssetModelQueryStatus?.isSuccess,
  ]);

  return successStatuses.every((status) => status !== true);
};
