import { TimeSeriesDataModule } from '@iot-app-kit/core';
import { SiteWiseAssetSession } from '../asset-modules';
import { SiteWiseAlarmModule } from '../alarms/iotevents';
import { fetchAssetModelsFromQuery } from '../asset-modules/util/fetchAssetModelsFromQuery';
import { fetchAlarmsFromQuery } from '../alarms/iotevents/util/fetchAlarmsFromQuery';
import { CreateTimeSeriesDataStore } from './store';
import type { DataModuleSubscription, TimeSeriesData, SubscriptionUpdate } from '@iot-app-kit/core';
import type { SiteWiseDataStreamQuery } from './types';

export const subscribeToTimeSeriesData =
  (
    dataModule: TimeSeriesDataModule<SiteWiseDataStreamQuery>,
    assetModuleSession: SiteWiseAssetSession,
    alarmModule: SiteWiseAlarmModule
  ) =>
  ({ queries, request }: DataModuleSubscription<SiteWiseDataStreamQuery>, callback: (data: TimeSeriesData) => void) => {
    const store = new CreateTimeSeriesDataStore({
      initialState: {
        dataStreams: [],
        thresholds: [],
        assetModels: {},
        alarms: {},
        errors: {},
      },
      callback,
    });

    const { update, unsubscribe } = dataModule.subscribeToDataStreams({ queries, request }, (data) => {
      store.appendTimeSeriesData({
        dataStreams: data.dataStreams,
        viewport: data.viewport,
      });
    });

    const updateAssetModels = (queries: SiteWiseDataStreamQuery[]) => {
      (async () => {
        for await (const response of fetchAssetModelsFromQuery({ queries, assetModuleSession })) {
          const assetModels = 'assetModels' in response && response.assetModels;
          const errors = 'errors' in response && response.errors;

          if (assetModels) {
            store.appendTimeSeriesData({ assetModels });
          }

          if (errors) {
            store.appendTimeSeriesData({ errors });
          }
        }
      })();
    };
    updateAssetModels(queries);

    const updateAlarms = (queries: SiteWiseDataStreamQuery[]) => {
      (async () => {
        for await (const { alarms, thresholds } of fetchAlarmsFromQuery({ queries, alarmModule })) {
          store.appendTimeSeriesData({ alarms, thresholds });
        }
      })();
    };
    updateAlarms(queries);

    return {
      unsubscribe: () => {
        unsubscribe();
      },
      update: (subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>) => {
        update(subscriptionUpdate);
        const { queries } = subscriptionUpdate;

        if (queries) {
          updateAssetModels(queries);
          updateAlarms(queries);
        }
      },
    };
  };
