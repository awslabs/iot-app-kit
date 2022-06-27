import { DescribeAlarmModelResponse } from '@aws-sdk/client-iot-events';
import {
  DescribeAssetModelResponse,
  AssetPropertyValue,
  BatchGetAssetPropertyValueHistoryResponse
} from '@aws-sdk/client-iotsitewise';
import { ALARM_STATUS } from '../alarms/iotevents/constants';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';
import { ComparisonOperator } from '@aws-sdk/client-iot-events';
import { TimeSeriesData } from '@iot-app-kit/core';
import { Alarm } from '../alarms/iotevents';

export const ALARM_ASSET_MODEL_ID = 'asset-model-with-alarms';

export const INPUT_PROPERTY_ID = 'input-property-id';

export const THRESHOLD_PROPERTY_ID = 'threshold-property-id';

export const ALARM_STATE_PROPERTY_ID = 'alarm-state-property-id';

export const ALARM_SOURCE_PROPERTY_ID = 'alarm-source-property-id';

export const ALARM_MODEL_NAME = `TestAlarmModel_assetModel_${ALARM_ASSET_MODEL_ID}`;

export const ALARM_MODEL_ARN = `arn:aws:iotevents:us-east-1:account-id:alarmModel/${ALARM_MODEL_NAME}`;

export const ALARM_STATE_JSON_BLOB = {
  stateName: ALARM_STATUS.ACTIVE,
  ruleEvaluation: {
    simpleRule: {
      inputProperty: 31.524855556613428,
      operator: 'GREATER',
      threshold: 30.0
    }
  }
}

export const ALARM_MODEL: DescribeAlarmModelResponse = {
  creationTime: new Date(),
  lastUpdateTime: new Date(),
  alarmCapabilities: {
    acknowledgeFlow: {
      enabled: false
    },
    initializationConfiguration: {
      disabledOnInitialization: false
    }
  },
  roleArn: 'arn:aws:iam::account-id:role/IoTSiteWiseDemoAssets-IoTSiteWiseDemoIotEventsActi-7JVOD1P2ET54',
  severity: 1,
  status: 'ACTIVE',
  alarmModelArn: ALARM_MODEL_ARN,
  alarmModelDescription: '',
  alarmModelName: ALARM_MODEL_NAME,
  alarmModelVersion: '1',
  alarmRule: {
    simpleRule: {
      comparisonOperator: 'GREATER',
      inputProperty: `$sitewise.assetModel.${'`'}${ALARM_ASSET_MODEL_ID}${'`'}.${'`'}${INPUT_PROPERTY_ID}${'`'}.propertyValue.value`,
      threshold: `$sitewise.assetModel.${'`'}${ALARM_ASSET_MODEL_ID}${'`'}.${'`'}${THRESHOLD_PROPERTY_ID}${'`'}.propertyValue.value`
    }
  }
};

export const ASSET_MODEL_COMPOSITE_MODELS_WITH_ALARM = [
  {
    name: 'test',
    properties: [
      {
        dataType: 'STRING',
        id: 'alarm-type-id',
        name: 'AWS/ALARM_TYPE',
        type: {
          attribute: {
            defaultValue: 'IOT_EVENTS'
          }
        }
      },
      {
        dataType: 'STRUCT',
        dataTypeSpec: 'AWS/ALARM_STATE',
        id: ALARM_STATE_PROPERTY_ID,
        name: 'AWS/ALARM_STATE',
        type: {
          measurement: {}
        }
      },
      {
        dataType: 'STRING',
        id: ALARM_SOURCE_PROPERTY_ID,
        name: 'AWS/ALARM_SOURCE',
        type: {
          attribute: {
            defaultValue: ALARM_MODEL_ARN
          }
        }
      }
    ],
    type: 'AWS/ALARM'
  }
];

export const ASSET_MODEL_WITH_ALARM: DescribeAssetModelResponse = {
  assetModelArn: `arn:aws:iotsitewise:us-east-1:account-id:asset-model/${ALARM_ASSET_MODEL_ID}`,
  assetModelCompositeModels: ASSET_MODEL_COMPOSITE_MODELS_WITH_ALARM,
  assetModelCreationDate: new Date(),
  assetModelDescription: 'testAssetModel',
  assetModelHierarchies: [],
  assetModelId: ALARM_ASSET_MODEL_ID,
  assetModelLastUpdateDate: new Date(),
  assetModelName: 'testAssetModel',
  assetModelProperties: [
    {
      dataType: 'INTEGER',
      id: INPUT_PROPERTY_ID,
      name: 'inputProperty',
      type: {
        measurement: {}
      },
      unit: 'Celsius'
    },
    {
      dataType: 'INTEGER',
      id: THRESHOLD_PROPERTY_ID,
      name: 'thresholdProperty',
      type: {
        measurement: {}
      },
      unit: 'Celsius'
    },
  ],
  assetModelStatus: {
    state: 'ACTIVE'
  }
};

export const ALARM_STATE_PROPERTY_VALUE: AssetPropertyValue = {
  value: {
    stringValue: JSON.stringify(ALARM_STATE_JSON_BLOB),
  },
  timestamp: {
    timeInSeconds: 1000,
    offsetInNanos: 0,
  },
};

export const ALARM_STATE_PROPERTY_VALUE2: AssetPropertyValue = {
  value: {
    stringValue: JSON.stringify({
      ...ALARM_STATE_JSON_BLOB,
      stateName: ALARM_STATUS.NORMAL,
    }),
  },
  timestamp: {
    timeInSeconds: 2000,
    offsetInNanos: 0,
  },
};

export const ALARM_SOURCE_PROPERTY_VALUE: AssetPropertyValue = {
  value: {
    stringValue: ALARM_MODEL_ARN
  },
  timestamp: {
    timeInSeconds: 1000,
    offsetInNanos: 0,
  },
};

export const THRESHOLD_PROPERTY_VALUE: AssetPropertyValue = {
  value: {
    stringValue: ComparisonOperator.GREATER
  },
  timestamp: {
    timeInSeconds: 1000,
    offsetInNanos: 0,
  },
};

export const ALARM_ASSET_ID = 'alarm-asset-id';

export const ALARM: Alarm = {
  assetId: ALARM_ASSET_ID,
  inputPropertyId: INPUT_PROPERTY_ID,
  alarmStatePropertyId: ALARM_STATE_PROPERTY_ID,
  thresholdPropertyId: THRESHOLD_PROPERTY_ID,
  threshold: 30,
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
  severity: 3,
  rule: 'RPM > 30',
  state: 'ACTIVE',
}

export const TIME_SERIES_DATA_WITH_ALARMS = {
  annotations: {
    y: [
      {
        color: '#d13212',
        comparisonOperator: 'GT',
        dataStreamIds: [
          'alarm-asset-id---input-property-id'
        ],
        description: 'inputProperty > GREATER',
        icon: 'active',
        severity: 1,
        showValue: true,
        value: NaN
      },
      {
        color: '#d13212',
        comparisonOperator: 'EQ',
        dataStreamIds: [
          'alarm-asset-id---alarm-state-property-id'
        ],
        description: 'inputProperty > GREATER',
        icon: 'active',
        severity: 1,
        value: 'Active'
      },
      {
        color: '#f89256',
        comparisonOperator: 'EQ',
        dataStreamIds: [
          'alarm-asset-id---alarm-state-property-id'
        ],
        description: 'inputProperty > GREATER',
        icon: 'latched',
        severity: 2,
        value: 'Latched'
      },
      {
        color: '#3184c2',
        comparisonOperator: 'EQ',
        dataStreamIds: [
          'alarm-asset-id---alarm-state-property-id'
        ],
        description: 'inputProperty > GREATER',
        icon: 'acknowledged',
        severity: 3,
        value: 'Acknowledged'
      },
      {
        color: '#1d8102',
        comparisonOperator: 'EQ',
        dataStreamIds: [
          'alarm-asset-id---alarm-state-property-id'
        ],
        description: 'inputProperty > GREATER',
        icon: 'normal',
        severity: 4,
        value: 'Normal'
      },
      {
        color: '#879596',
        comparisonOperator: 'EQ',
        dataStreamIds: [
          'alarm-asset-id---alarm-state-property-id'
        ],
        description: 'inputProperty > GREATER',
        icon: 'snoozed',
        severity: 5,
        value: 'SnoozeDisabled'
      },
      {
        color: '#687078',
        comparisonOperator: 'EQ',
        dataStreamIds: [
          'alarm-asset-id---alarm-state-property-id'
        ],
        description: 'inputProperty > GREATER',
        icon: 'disabled',
        severity: 6,
        value: 'Disabled'
      }
    ]
  },
  dataStreams: [{
    id: 'alarm-asset-id---alarm-state-property-id',
    streamType: 'ALARM',
    name: 'AWS/ALARM_STATE',
    resolution: 0,
    refId: undefined,
    isRefreshing: false,
    isLoading: false,
    error: undefined,
    dataType: 'NUMBER',
    aggregates: {},
    data: [
      {
        x: 1000000,
        y: 'Active',
      },
      {
        x: 2000000,
        y: 'Normal',
      },
    ],
  }],
  viewport: {
    duration: '5m'
  }
} as TimeSeriesData;

export const ALARM_PROPERTY_VALUE_HISTORY: BatchGetAssetPropertyValueHistoryResponse = {
  successEntries: [
    {
      entryId: '0-0',
      assetPropertyValueHistory: [
        ALARM_STATE_PROPERTY_VALUE,
        ALARM_STATE_PROPERTY_VALUE2,
      ]
    }
  ],
  errorEntries: [],
  skippedEntries: [],
};
