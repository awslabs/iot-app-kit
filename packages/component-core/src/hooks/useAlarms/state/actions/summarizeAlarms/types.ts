import type {
  DescribeAssetModelResponse,
  DescribeAssetResponse,
} from '@aws-sdk/client-iotsitewise';
import type {
  AlarmAssetModelRequest,
  AlarmAssetRequest,
  AlarmCompositeModelRequest,
  AlarmDataStatus,
  AlarmInputPropertyRequest,
} from '../../../types';

/**
 * Summarize Alarms
 */
export interface AlarmAssetSummary {
  // dont depend on UseQueryResult map out data and status
  request:
    | AlarmCompositeModelRequest
    | AlarmInputPropertyRequest
    | AlarmAssetRequest;
  status: AlarmDataStatus;
  data: DescribeAssetResponse | undefined;
}

export interface AlarmAssetModelSummary {
  request: AlarmAssetModelRequest;
  status: AlarmDataStatus;
  data: DescribeAssetModelResponse | undefined;
}

export interface SummarizeAlarmActionPayload {
  assetModelSummaries?: AlarmAssetModelSummary[];
  assetSummaries?: AlarmAssetSummary[];
}

export interface SummarizeAlarmAction extends SummarizeAlarmActionPayload {
  type: 'SUMMARIZE_ALARMS';
}
