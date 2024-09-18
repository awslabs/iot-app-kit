import {
  AssetCompositeModel,
  AssetModelCompositeModel,
  DescribeAssetModelResponse,
  DescribeAssetResponse,
} from '@aws-sdk/client-iotsitewise';
import type {
  AlarmData,
  AlarmDataInternal,
  AlarmDataStatus,
  AlarmRequest,
} from '../types';
import {
  getAlarmPropertiesFromCompositeModel,
  isAlarmCompositeModel,
} from './parseCompositeModels';
import { constructAlarmProperty } from './constructAlarmProperty';

/**
 * Creates an AlarmData object for each alarm composite model on a SiteWise asset.
 * The content of AlarmData depends on the AlarmRequest argument.
 *
 * @param request is an AlarmRequest that may have an assetId
 * @param status is the status of the DescribeAssetResponse query
 * @param assetResponse is the DescribeAssetResponse
 * @returns a list of AlarmData for all alarms on an asset
 */
export const createFromAssetResponse = ({
  request,
  status,
  assetResponse,
}: {
  request: AlarmRequest;
  status: AlarmDataStatus;
  assetResponse?: DescribeAssetResponse;
}): AlarmDataInternal[] => {
  const { assetId, assetCompositeModelId } = request;

  const defaultAlarmDataResponse = [
    {
      request,
      assetId,
      compositeModelId: assetCompositeModelId,
      status,
    },
  ] satisfies AlarmDataInternal[];

  if (!assetResponse || !assetId) {
    return defaultAlarmDataResponse;
  }

  if (assetResponse && assetId && assetResponse?.assetId !== assetId) {
    console.error(
      'createFromAssetResponse expects there to be an assetId in the request that matches the DescribeAssetResponse'
    );
    return defaultAlarmDataResponse;
  }

  // Find all alarms
  const alarmCompositeModels = assetResponse?.assetCompositeModels?.filter(
    isAlarmCompositeModel
  );

  // If request is for one alarm, only build AlarmData for the given composite model id
  if (assetCompositeModelId) {
    const foundCompositeModel = alarmCompositeModels?.find(
      (compositeModel) => compositeModel.id === assetCompositeModelId
    );
    if (foundCompositeModel) {
      const alarmData = createFromCompositeModel(foundCompositeModel, status);
      return [
        {
          ...alarmData,
          assetModelId: assetResponse?.assetModelId,
          assetId: assetResponse?.assetId,
          request,
          properties: assetResponse.assetProperties,
        },
      ] satisfies AlarmDataInternal[];
    }
  } else {
    // Build AlarmData for all alarm composite models on the asset
    return (
      alarmCompositeModels?.map((compositeModel) => {
        const alarmData = createFromCompositeModel(compositeModel, status);
        return {
          ...alarmData,
          assetModelId: assetResponse?.assetModelId,
          assetId: assetResponse?.assetId,
          request,
          properties: assetResponse.assetProperties,
        } satisfies AlarmDataInternal;
      }) ?? []
    );
  }

  // Return empty list of there are no alarms that meet the AlarmRequest criteria
  return [];
};

/**
 * Creates an AlarmData object for each alarm assetModel composite model on a SiteWise assetModel.
 *
 * @param request is an AlarmRequest that may have an assetModelId
 * @param status is the status of the DescribeAssetModelResponse query
 * @param assetModelResponse is the DescribeAssetModelResponse
 * @returns a list of AlarmData for all alarms on an assetModel
 */
export const createFromAssetModelResponse = ({
  request,
  status,
  assetModelResponse,
}: {
  request: AlarmRequest;
  status: AlarmDataStatus;
  assetModelResponse?: DescribeAssetModelResponse;
}): AlarmDataInternal[] => {
  const { assetModelId } = request;

  const defaultAlarmDataResponse = [
    {
      request,
      assetModelId,
      status,
    },
  ] satisfies AlarmDataInternal[];

  if (!assetModelResponse || !assetModelId) {
    return defaultAlarmDataResponse;
  }

  if (assetModelId && assetModelResponse?.assetModelId !== assetModelId) {
    console.error(
      'createFromAssetModelResponse expects there to be an assetModelId in the request that matches the DescribeAssetModelResponse'
    );
    return defaultAlarmDataResponse;
  }

  // Find all alarms
  const alarmModelCompositeModels =
    assetModelResponse?.assetModelCompositeModels?.filter(
      isAlarmCompositeModel
    );

  // Build AlarmData for all alarm composite models on the assetModel
  return (
    alarmModelCompositeModels?.map((compositeModel) => {
      const alarmData = createFromCompositeModel(compositeModel, status);
      return {
        ...alarmData,
        assetModelId: assetModelResponse?.assetModelId,
        request,
        properties: assetModelResponse?.assetModelProperties,
      };
    }) ?? []
  );
};

/**
 * Creates AlarmData for a provided compositeModel
 *
 * @param compositeModel is the asset or assetModel compositeModel
 * @param status is the query status for fetching the compositeModel
 * @returns an AlarmData object with content from the compositeModel
 */
export const createFromCompositeModel = (
  compositeModel: AssetCompositeModel | AssetModelCompositeModel,
  status: AlarmDataStatus
) => {
  const alarmProperties = getAlarmPropertiesFromCompositeModel(compositeModel);
  const alarmData: AlarmData = {
    compositeModelId: compositeModel.id,
    compositeModelName: compositeModel.name,
    state: constructAlarmProperty(alarmProperties?.state),
    type: constructAlarmProperty(alarmProperties?.type),
    source: constructAlarmProperty(alarmProperties?.source),
    status,
  };
  return alarmData;
};
