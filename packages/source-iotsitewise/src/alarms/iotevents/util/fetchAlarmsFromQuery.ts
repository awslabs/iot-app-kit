import { toId } from '../../../time-series-data/util/dataStreamId';
import { constructAlarmThresholds } from './constructAlarmThresholds';
import { SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { Alarms } from '../types';
import { Annotations } from '@synchro-charts/core';
import { SiteWiseAlarmModule } from '../siteWiseAlarmModule';

export async function* fetchAlarmsFromQuery({
  queries,
  alarmModule,
}: {
  queries: SiteWiseDataStreamQuery[];
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
