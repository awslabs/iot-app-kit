import { toId } from '../../../time-series-data/util/dataStreamId';
import { constructAlarmThresholds } from './constructAlarmThresholds';
import { Alarms } from '../types';
import { Annotations } from '@iot-app-kit/core';
import { SiteWiseAlarmModule } from '../siteWiseAlarmModule';
import { SiteWiseDataStreamQuery } from '../../../time-series-data/types';
import { isDefined } from '../../../common/predicates';

export async function* fetchAlarmsFromQuery({
  queries,
  alarmModule,
}: {
  queries: SiteWiseDataStreamQuery[];
  alarmModule: SiteWiseAlarmModule;
}): AsyncGenerator<{ alarms: Alarms; annotations: Annotations }> {
  const assetQueries = queries.map((query) => ('assets' in query ? query.assets : undefined)).filter(isDefined);

  for (const assets of assetQueries) {
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
