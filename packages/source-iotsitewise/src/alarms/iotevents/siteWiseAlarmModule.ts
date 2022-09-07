import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { EventsClient } from './client';
import { Cache } from './cache';
import { Alarm, AlarmModel } from './types';
import { getAlarmModelName } from './util/getAlarmModelName';
import { parseAlarmData } from './util/parseAlarmData';
import { getPropertyId } from './util/getPropertyId';
import { COMPARISON_SYMBOL } from './constants';
import { toValue } from '../../time-series-data/util/toDataPoint';
import { SiteWiseAssetModule, SiteWiseAssetSession } from '../../asset-modules';
import { getAlarmSourceProperty } from './util/getAlarmSourceProperty';

export class SiteWiseAlarmModule {
  private readonly client: EventsClient;
  private readonly assetModuleSession: SiteWiseAssetSession;
  private readonly cache: Cache;

  constructor(client: IoTEventsClient, siteWiseAssetModule: SiteWiseAssetModule) {
    this.client = new EventsClient(client);
    this.assetModuleSession = siteWiseAssetModule.startSession();
    this.cache = new Cache(this.client);
  }

  async getAlarmModel(name: string): Promise<AlarmModel> {
    return this.cache.getAlarmModel(name);
  }

  async getAlarm({
    assetId,
    alarmStatePropertyId,
  }: {
    assetId: string;
    alarmStatePropertyId: string;
  }): Promise<Alarm | undefined> {
    try {
      const alarmAsset = await this.assetModuleSession.fetchAssetSummary({ assetId });

      const assetModelId = alarmAsset?.assetModelId;

      const assetModel = await this.assetModuleSession.fetchAssetModel({ assetModelId: assetModelId as string });

      const alarmSourceId = getAlarmSourceProperty(assetModel, alarmStatePropertyId)?.id;

      if (!alarmSourceId) {
        return undefined;
      }

      const alarmSourcePropertyValue = await this.assetModuleSession.fetchAssetPropertyValue({
        assetId,
        propertyId: alarmSourceId as string,
      });

      const alarmModelName = getAlarmModelName(toValue(alarmSourcePropertyValue.value) as string);

      const {
        comparisonOperator,
        thresholdPropertyId: thresholdPropertyIdExpression,
        inputPropertyId: inputPropertyIdExpression,
        severity,
      } = await this.getAlarmModel(alarmModelName);

      const alarmStatePropertyValue = await this.assetModuleSession.fetchAssetPropertyValue({
        assetId: assetId,
        propertyId: alarmStatePropertyId,
      });
      const state = parseAlarmData(toValue(alarmStatePropertyValue.value) as string);

      const thresholdPropertyId = getPropertyId(thresholdPropertyIdExpression) as string;
      const thresholdPropertyValue = await this.assetModuleSession.fetchAssetPropertyValue({
        assetId,
        propertyId: thresholdPropertyId as string,
      });

      const inputPropertyId = getPropertyId(inputPropertyIdExpression) as string;
      const inputPropertyName = assetModel.assetModelProperties?.find(({ id }) => id === inputPropertyId)?.name;

      const threshold = toValue(thresholdPropertyValue.value);

      const rule = `${inputPropertyName} ${COMPARISON_SYMBOL[comparisonOperator]} ${threshold}`;

      return {
        assetId,
        alarmStatePropertyId,
        inputPropertyId,
        thresholdPropertyId,
        comparisonOperator,
        threshold,
        severity,
        rule,
        state,
      };
    } catch {
      return undefined;
    }
  }
}
