import { toId } from '../../../time-series-data/util/dataStreamId';
import { constructAlarmThresholds } from './constructAlarmThresholds';
import { SiteWiseAlarmModule } from '../siteWiseAlarmModule';
import { isDefined } from '../../../common/predicates';
import type { Alarms } from '../types';
import type { Threshold } from '@iot-app-kit/core';
import type { SiteWiseDataStreamQuery } from '../../../time-series-data/types';

export async function* fetchAlarmsFromQuery({
  queries,
  alarmModule,
}: {
  queries: SiteWiseDataStreamQuery[];
  alarmModule: SiteWiseAlarmModule;
}): AsyncGenerator<{ alarms: Alarms; thresholds: Threshold[] }> {
  const assetQueries = queries.map((query) => ('assets' in query ? query.assets : undefined)).filter(isDefined);

  for (const assets of assetQueries) {
    for (const { assetId, properties } of assets) {
      for (const { propertyId } of properties) {
        const alarm = await alarmModule.getAlarm({ assetId, alarmStatePropertyId: propertyId });

        if (alarm) {
          const alarmStreamId = toId({ assetId, propertyId });

          const thresholds = constructAlarmThresholds(alarm);

          yield { alarms: { [alarmStreamId]: alarm }, thresholds };
        }
      }
    }
  }
}
