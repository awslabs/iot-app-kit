export const getAlarmModelName = (alarmSourceArn: string): string => {
  const splitAlarmArn = alarmSourceArn.split('/');

  return splitAlarmArn[splitAlarmArn.length - 1];
};
