export class DescribeAlarmModelCacheKeyFactory {
  #alarmModelName?: string;
  #alarmModelVersion?: string;

  constructor({
    alarmModelName,
    alarmModelVersion,
  }: {
    alarmModelName?: string;
    alarmModelVersion?: string;
  }) {
    this.#alarmModelName = alarmModelName;
    this.#alarmModelVersion = alarmModelVersion;
  }

  create() {
    const cacheKey = [
      {
        resource: 'describe alarm model',
        alarmModelName: this.#alarmModelName,
        alarmModelVersion: this.#alarmModelVersion,
      },
    ] as const;

    return cacheKey;
  }
}
