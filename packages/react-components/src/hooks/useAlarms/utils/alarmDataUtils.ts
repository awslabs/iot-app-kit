import {
  AssetProperty,
  DescribeAssetModelResponse,
  DescribeAssetResponse,
} from '@aws-sdk/client-iotsitewise';
import { AlarmData, AlarmDataStatus, AlarmRequest } from '../types';
import {
  buildFromCompositeModel,
  isAlarmCompositeModel,
} from './compositeModelUtils';

/**
 * This function builds an AlarmData object for each alarm composite model on a SiteWise asset.
 * The content of AlarmData depends on the AlarmRequest argument.
 *
 * @param request is an AlarmRequest that may have an assetId
 * @param status is the status of the DescribeAssetResponse query
 * @param assetResponse is the DescribeAssetResponse
 * @returns a list of AlarmData for all alarms on an asset
 */
export const buildFromAssetResponse = ({
  request,
  status,
  assetResponse,
}: {
  request: AlarmRequest;
  status: AlarmDataStatus;
  assetResponse?: DescribeAssetResponse;
}): AlarmData[] => {
  const { assetId, assetCompositeModelId, inputPropertyId, assetModelId } =
    request;

  if (!assetResponse || !assetId) {
    return [
      {
        assetModelId,
        assetId,
        compositeModelId: assetCompositeModelId,
        status,
      },
    ];
  }

  if (assetResponse && assetId && assetResponse?.assetId !== assetId) {
    throw new Error(
      'AlarmDataFactory.buildFromAssetResponse expects there to be an assetId in the request that matches the DescribeAssetResponse'
    );
  }

  // Find all alarms
  const alarmCompositeModels = assetResponse?.assetCompositeModels?.filter(
    isAlarmCompositeModel
  );

  /**
   * Find inputProperty from asset summary if requested.
   *
   * Used as an indicator in useAlarms to filter out alarms
   * when the inputProperty from IoT Events alarmModels don't match.
   */
  let inputPropertyList: AssetProperty[] | undefined;
  if (inputPropertyId) {
    const inputProperty = assetResponse?.assetProperties?.find(
      (property) => property.id === inputPropertyId
    );
    if (inputProperty) {
      inputPropertyList = [inputProperty];
    }
  }

  // If request is for one alarm, only build AlarmData for the given composite model id
  if (assetCompositeModelId) {
    const foundCompositeModel = alarmCompositeModels?.find(
      (compositeModel) => compositeModel.id === assetCompositeModelId
    );
    if (foundCompositeModel) {
      const alarmData = buildFromCompositeModel(foundCompositeModel, status);
      return [
        {
          ...alarmData,
          assetModelId: assetResponse?.assetModelId,
          assetId: assetResponse?.assetId,
        },
      ];
    }
  } else {
    // Build AlarmData for all alarm composite models on the asset
    return (
      alarmCompositeModels?.map((compositeModel) => {
        const alarmData = buildFromCompositeModel(compositeModel, status);
        return {
          ...alarmData,
          assetModelId: assetResponse?.assetModelId,
          assetId: assetResponse?.assetId,
          inputProperty: inputPropertyList,
        };
      }) ?? []
    );
  }

  // Return empty list of there are no alarms that meet the AlarmRequest criteria
  return [];
};

/**
 *
 * @param request is an AlarmRequest that may have an assetModelId
 * @param status is the status of the DescribeAssetModelResponse query
 * @param assetModelResponse is the DescribeAssetModelResponse
 * @returns a list of AlarmData for all alarms on an assetModel
 */
export const buildFromAssetModelResponse = ({
  request,
  status,
  assetModelResponse,
}: {
  request: AlarmRequest;
  status: AlarmDataStatus;
  assetModelResponse?: DescribeAssetModelResponse;
}): AlarmData[] => {
  const { assetModelId } = request;

  if (!assetModelResponse || !assetModelId) {
    return [
      {
        assetModelId,
        status,
      },
    ];
  }

  if (assetModelId && assetModelResponse?.assetModelId !== assetModelId) {
    throw new Error(
      'AlarmDataFactory.buildFromAssetModelResponse expects there to be an assetModelId in the request that matches the DescribeAssetModelResponse'
    );
  }

  // Find all alarms
  const alarmModelCompositeModels =
    assetModelResponse?.assetModelCompositeModels?.filter(
      isAlarmCompositeModel
    );

  // Build AlarmData for all alarm composite models on the assetModel
  return (
    alarmModelCompositeModels?.map((compositeModel) => {
      const alarmData = buildFromCompositeModel(compositeModel, status);
      return {
        ...alarmData,
        assetModelId: assetModelResponse?.assetModelId,
      };
    }) ?? []
  );
};
