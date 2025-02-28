import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { type AlarmData } from '../types';
import { useLatestAssetPropertyValues } from '../../../queries';
import { useReactQueryEffect } from './useReactQueryEffect';
import {
  type OnUpdateAlarmSourceDataAction,
  useRequestSelector,
} from '../state';
import { getStatusForQuery } from '../utils/queryStatus';

export type UseAlarmSourcesOptions = {
  iotSiteWiseClient?: IoTSiteWiseClient;
  requests?: Pick<AlarmData, 'assetId' | 'source'>[];
  onUpdateAlarmSourceData: OnUpdateAlarmSourceDataAction;
};

export const useAlarmSources = ({
  iotSiteWiseClient,
  requests = [],
  onUpdateAlarmSourceData,
}: UseAlarmSourcesOptions) => {
  const alarmPropertyRequests = useRequestSelector(
    requests,
    (alarmSourceRequests) =>
      alarmSourceRequests.map(({ assetId, source }) => ({
        assetId,
        propertyId: source?.property.id,
      }))
  );

  const alarmSourceQueries = useLatestAssetPropertyValues({
    iotSiteWiseClient,
    requests: alarmPropertyRequests,
    refreshRate: Infinity,
  });

  useReactQueryEffect(() => {
    onUpdateAlarmSourceData({
      assetPropertyValueSummaries: alarmSourceQueries.map((query, index) => ({
        request: alarmPropertyRequests[index],
        data: query.data,
        status: getStatusForQuery(query),
      })),
    });
  }, [alarmSourceQueries]);
};
