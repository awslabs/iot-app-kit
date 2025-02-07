import { useMemo } from 'react';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { AlarmDataInternal, AlarmProperty } from '../types';
import { useLatestAssetPropertyValues } from '../../../queries';
import { getStatusForQuery } from '../utils/queryStatus';
import { isAlarmProperty } from './predicates';
import { constructAlarmProperty } from '../utils/constructAlarmProperty';

export interface UseLatestAlarmPropertyValuesOptions {
  alarmPropertyFieldName: keyof AlarmDataInternal;
  iotSiteWiseClient?: IoTSiteWiseClient;
  alarmDataList?: AlarmDataInternal[];
  enabled?: boolean;
}

/**
 * useLatestAlarmPropertyValues is a hook used to fetch the latest
 * asset property value for a SiteWise alarm composite property
 *
 * @param alarmPropertyFieldName is the name of an alarm property field
 * 'state' | 'type' | 'source'
 * @param iotSiteWiseClient is an AWS SDK IoT SiteWise client
 * @param alarmDataList is a list of AlarmData
 * @param enabled will manually disable the hook
 * @returns a list of AlarmData with the latest property value injected
 * into the associated property field
 */
export function useLatestAlarmPropertyValues({
  alarmPropertyFieldName,
  iotSiteWiseClient,
  alarmDataList = [],
  enabled,
}: UseLatestAlarmPropertyValuesOptions): AlarmDataInternal[] {
  // Filter AlarmData with an existing property for alarmPropertyFieldName
  const alarmPropertyRequests = alarmDataList
    .filter((alarmData) =>
      isAlarmProperty(alarmData[alarmPropertyFieldName] as AlarmProperty)
    )
    .map((alarmData) => ({
      assetId: alarmData.assetId,
      propertyId: (alarmData[alarmPropertyFieldName] as AlarmProperty).property
        .id,
    }));

  // Fetch latest asset property value for requested properties from the alarmDataList
  const alarmPropertyQueries = useLatestAssetPropertyValues({
    iotSiteWiseClient,
    requests: alarmPropertyRequests,
    enabled,
    refreshRate: Infinity,
  });

  return useMemo(() => {
    // Walk through the alarmDataList to inject the asset property value for a matching request.
    // filteredIndex tracks progress through the filtered request list and associated query responses.
    // Both lists have the same order, where the alarmDataList may have more elements than the filtered list.
    let filteredIndex = 0;
    return (
      alarmDataList?.map((alarmData) => {
        // Try to access AlarmData alarm property
        const alarmProperty: AlarmProperty | undefined = alarmData[
          alarmPropertyFieldName
        ] as AlarmProperty;
        if (
          alarmProperty !== undefined &&
          filteredIndex < alarmPropertyRequests.length &&
          alarmPropertyRequests[filteredIndex].assetId === alarmData.assetId &&
          alarmPropertyRequests[filteredIndex].propertyId ===
            alarmProperty.property.id
        ) {
          const status = getStatusForQuery(
            alarmPropertyQueries[filteredIndex],
            alarmData.status
          );
          const newAlarmProperty = constructAlarmProperty(
            alarmProperty.property,
            alarmPropertyQueries[filteredIndex].data?.propertyValue
          );
          filteredIndex++;

          // Inject alarm asset property data into the AlarmData
          return {
            ...alarmData,
            [alarmPropertyFieldName]: newAlarmProperty,
            status,
          };
        } else {
          return alarmData;
        }
      }) ?? []
    );
  }, [
    alarmDataList,
    alarmPropertyFieldName,
    alarmPropertyRequests,
    alarmPropertyQueries,
  ]);
}
