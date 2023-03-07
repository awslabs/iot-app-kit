import { toId } from '../../../time-series-data/util/dataStreamId';
import { constructAlarmThresholds } from './constructAlarmThresholds';
import { Alarms } from '../types';
import { Annotations } from '@iot-app-kit/core';
import { SiteWiseAlarmModule } from '../siteWiseAlarmModule';
import { SiteWiseAssetQuery } from '../../../time-series-data/types';

export async function* fetchAlarmsFromQuery({
  queries,
  alarmModule,
}: {
  queries: SiteWiseAssetQuery[];
  alarmModule: SiteWiseAlarmModule;
}): AsyncGenerator<{ alarms: Alarms; annotations: Annotations }> {
  for (const { assets } of queries) {
    for (const { assetId, properties } of assets) {
      for (const { propertyId } of properties) {
        const alarm = await alarmModule.getAlarm({ assetId, alarmStatePropertyId: propertyId });

        if (alarm) {
          const alarmStreamId = toId({ assetId, propertyId });

          const thresholds = constructAlarmThresholds(alarm);

          yield { alarms: { [alarmStreamId]: alarm }, annotations: { y: thresholds } };
        }
      }
    }
  }
}
