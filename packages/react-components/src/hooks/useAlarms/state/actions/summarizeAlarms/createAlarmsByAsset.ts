import {
  getAlarmPropertiesFromCompositeModel,
  isAlarmCompositeModel,
} from '../../../utils/parseCompositeModels';
import { constructAlarmProperty } from '../../../utils/constructAlarmProperty';
import {
  AlarmAssetRequest,
  AlarmCompositeModelRequest,
  AlarmInputPropertyRequest,
} from '../../../types';
import { AlarmAssetSummary } from './types';
import { AlarmRequestState, AlarmDataState } from '../../types';

export const createAlarmsByAsset = ({
  request,
  status: describeAssetQueryStatus,
  data,
}: AlarmAssetSummary): AlarmRequestState<
  AlarmCompositeModelRequest | AlarmInputPropertyRequest | AlarmAssetRequest
> => {
  if (!describeAssetQueryStatus.isSuccess) {
    return {
      request,
      describeAssetQueryStatus,
      alarmDatas: [],
    };
  }

  if (data?.assetId !== request.assetId) {
    throw 'DescribeAssetResponse query response and request do not match.';
  }

  const alarmCompositeModels = (data?.assetCompositeModels ?? [])
    .filter(isAlarmCompositeModel)
    .filter((compositeModel) =>
      request?.assetCompositeModelId
        ? compositeModel.id === request.assetCompositeModelId
        : true
    );

  const alarmDatas = alarmCompositeModels.map(
    (compositeModel): AlarmDataState => {
      const alarmProperties =
        getAlarmPropertiesFromCompositeModel(compositeModel);
      return {
        compositeModelId: compositeModel.id,
        compositeModelName: compositeModel.name,
        assetId: data?.assetId,
        assetModelId: data?.assetModelId,
        properties: data?.assetProperties,
        state: constructAlarmProperty(alarmProperties?.state),
        type: constructAlarmProperty(alarmProperties?.type),
        source: constructAlarmProperty(alarmProperties?.source),
      };
    }
  );

  return {
    request,
    describeAssetQueryStatus,
    alarmDatas,
  };
};
