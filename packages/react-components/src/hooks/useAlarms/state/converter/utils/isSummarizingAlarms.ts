import { createNonNullableList } from '../../../../../utils/createNonNullableList';
import { AlarmRequest } from '../../../types';
import { AlarmRequestState } from '../../types';

export const isSummarizingAlarms = ({
  describeAssetQueryStatus,
  describeAssetModelQueryStatus,
}: AlarmRequestState<AlarmRequest>) => {
  if (describeAssetQueryStatus == null && describeAssetModelQueryStatus == null)
    return true;

  const successStatuses = createNonNullableList([
    describeAssetQueryStatus?.isSuccess,
    describeAssetModelQueryStatus?.isSuccess,
  ]);

  return successStatuses.every((status) => status !== true);
};
