import { AlarmModels, AlarmModel } from './types';
import { EventsClient } from './client';
import { IoTEventsToSynchroChartsComparisonOperator } from './constants';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';

export class Cache {
  private readonly client: EventsClient;
  private readonly alarmModels: AlarmModels = {};

  constructor(client: EventsClient) {
    this.client = client;
  }

  async getAlarmModel(name: string): Promise<AlarmModel> {
    if (this.alarmModels[name]) {
      return this.alarmModels[name];
    }

    const { severity, alarmRule } = await this.client.getAlarmModel(name);

    if (!alarmRule?.simpleRule) {
      throw new Error('Could not get alarm rule');
    }

    const { inputProperty, comparisonOperator, threshold } = alarmRule.simpleRule;

    if (!inputProperty || !comparisonOperator || !threshold || !severity) {
      throw new Error('Could not parse alarm');
    }

    const inputPropertyId = inputProperty;
    const scComparisonOperator = IoTEventsToSynchroChartsComparisonOperator[comparisonOperator] as COMPARISON_OPERATOR;
    const thresholdPropertyId = threshold;

    const alarm = {
      inputPropertyId,
      comparisonOperator: scComparisonOperator,
      thresholdPropertyId,
      severity,
    };

    this.alarmModels[name] = alarm;

    return alarm;
  }
}
