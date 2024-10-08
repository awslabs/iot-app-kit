// import { getStatusForQuery } from "../../../utils/queryStatus";
import {
  getAlarmPropertiesFromCompositeModel,
  isAlarmCompositeModel,
} from '../../../utils/parseCompositeModels';
import { constructAlarmProperty } from '../../../utils/constructAlarmProperty';
import { AlarmAssetModelRequest } from '../../../types';
import { AlarmAssetModelSummary } from './types';
import { AlarmRequestState, AlarmDataState } from '../../types';

export const createAlarmsByAssetModel = ({
  request,
  status: describeAssetModelQueryStatus,
  data,
}: AlarmAssetModelSummary): AlarmRequestState<AlarmAssetModelRequest> => {
  if (!describeAssetModelQueryStatus.isSuccess) {
    return {
      request,
      describeAssetModelQueryStatus,
      alarmDatas: [],
    };
  }

  if (data?.assetModelId !== request.assetModelId) {
    throw 'DescribeAssetModelResponse query response and request do not match.';
  }

  const alarmModelCompositeModels = (
    data?.assetModelCompositeModels ?? []
  ).filter(isAlarmCompositeModel);

  const alarmDatas = alarmModelCompositeModels.map(
    (assetModelCompositeModel): AlarmDataState => {
      const alarmProperties = getAlarmPropertiesFromCompositeModel(
        assetModelCompositeModel
      );
      return {
        compositeModelId: assetModelCompositeModel.id,
        compositeModelName: assetModelCompositeModel.name,
        assetModelId: data?.assetModelId,
        properties: data?.assetModelProperties,
        state: constructAlarmProperty(alarmProperties?.state),
        type: constructAlarmProperty(alarmProperties?.type),
        source: constructAlarmProperty(alarmProperties?.source),
      };
    }
  );

  return {
    request,
    describeAssetModelQueryStatus,
    alarmDatas,
  };
};
