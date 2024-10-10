import {
  DescribeAssetModelResponse,
  DescribeAssetResponse,
} from '@aws-sdk/client-iotsitewise';
import {
  AlarmAssetModelRequest,
  AlarmAssetRequest,
  AlarmCompositeModelRequest,
  AlarmDataStatus,
  AlarmInputPropertyRequest,
} from '../../../types';

/**
 * Summarize Alarms
 */
export type AlarmAssetSummary = {
  /**
   * dont depend on UseQueryResult
   * map out data and status
   */
  request:
    | AlarmCompositeModelRequest
    | AlarmInputPropertyRequest
    | AlarmAssetRequest;
  status: AlarmDataStatus;
  data: DescribeAssetResponse | undefined;
};

export type AlarmAssetModelSummary = {
  request: AlarmAssetModelRequest;
  status: AlarmDataStatus;
  data: DescribeAssetModelResponse | undefined;
};

export type SummarizeAlarmActionPayload = {
  assetModelSummaries?: AlarmAssetModelSummary[];
  assetSummaries?: AlarmAssetSummary[];
};

export type SummarizeAlarmAction = SummarizeAlarmActionPayload & {
  type: 'SUMMARIZE_ALARMS';
};
