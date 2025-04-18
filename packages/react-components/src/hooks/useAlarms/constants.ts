export const ALARM_COMPOSITE_MODEL_TYPE = 'AWS/ALARM';
export const ALARM_STATE_PROPERTY_NAME = 'AWS/ALARM_STATE';
export const ALARM_TYPE_PROPERTY_NAME = 'AWS/ALARM_TYPE';
export const ALARM_SOURCE_PROPERTY_NAME = 'AWS/ALARM_SOURCE';

export const SITE_WISE_BACKED_PROPERTY_PREFIX = '$sitewise';

export const ALARM_STATUS = {
  ACTIVE: 'Active',
  NORMAL: 'Normal',
  LATCHED: 'Latched',
  DISABLED: 'Disabled',
  ACKNOWLEDGED: 'Acknowledged',
  SNOOZE_DISABLED: 'SnoozeDisabled',
} as const;
