import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { AlarmData } from '../types';
import { useLatestAssetPropertyValues } from '../../../queries';
import { useReactQueryEffect } from './useReactQueryEffect';
import { OnUpdateAlarmTypeDataAction, useRequestSelector } from '../state';
import { getStatusForQuery } from '../utils/queryStatus';

export type UseAlarmSourcesOptions = {
  iotSiteWiseClient?: IoTSiteWiseClient;
  requests?: Pick<AlarmData, 'assetId' | 'type'>[];
  onUpdateAlarmTypeData: OnUpdateAlarmTypeDataAction;
};

export const useAlarmTypes = ({
  iotSiteWiseClient,
  requests = [],
  onUpdateAlarmTypeData,
}: UseAlarmSourcesOptions) => {
  const alarmPropertyRequests = useRequestSelector(
    requests,
    (alarmSourceRequests) =>
      alarmSourceRequests.map(({ assetId, type }) => ({
        assetId,
        propertyId: type?.property.id,
      }))
  );

  const alarmTypeQueries = useLatestAssetPropertyValues({
    iotSiteWiseClient,
    requests: alarmPropertyRequests,
    refreshRate: Infinity,
  });

  useReactQueryEffect(() => {
    onUpdateAlarmTypeData({
      assetPropertyValueSummaries: alarmTypeQueries.map((query, index) => ({
        request: alarmPropertyRequests[index],
        data: query.data,
        status: getStatusForQuery(query),
      })),
    });
  }, [alarmTypeQueries]);
};
