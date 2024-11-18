import type {
  DescribeAlarmModelCommandInput,
  DescribeAlarmModelResponse,
  IoTEvents,
} from '@aws-sdk/client-iot-events';
import type {
  AssetPropertyValue,
  DescribeAssetCommandInput,
  DescribeAssetResponse,
  GetAssetPropertyValueCommandInput,
  GetAssetPropertyValueHistoryCommandInput,
  GetAssetPropertyValueHistoryResponse,
  GetAssetPropertyValueResponse,
  IoTSiteWise,
  TimeInNanos,
} from '@aws-sdk/client-iotsitewise';
import { DATA_TYPE } from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';
import { mockSinWaveDataValue } from './mockSinWaveData';
import { mockTimeSeriesDataQueryLiveStreamAggregated } from './mockTimeSeriesDataRealTime';

// Copied from @iot-app-kit/react-components/hooks/useAlarms/constants
const ALARM_COMPOSITE_MODEL_TYPE = 'AWS/ALARM';
const ALARM_STATE_PROPERTY_NAME = 'AWS/ALARM_STATE';
const ALARM_TYPE_PROPERTY_NAME = 'AWS/ALARM_TYPE';
const ALARM_SOURCE_PROPERTY_NAME = 'AWS/ALARM_SOURCE';

const MOCK_ALARM_ASSET_MODEL_ID = uuid();
const MOCK_ALARM_ASSET_ID = uuid();
const MOCK_ALARM_COMPOSITE_MODEL_ID = uuid();
const MOCK_ALARM_NAME = 'SpeedAlarm';

const MOCK_ALARM_STATE_PROPERTY_ID = uuid();
const MOCK_ALARM_TYPE_PROPERTY_ID = uuid();
const MOCK_ALARM_SOURCE_PROPERTY_ID = uuid();

const MOCK_ALARM_INPUT_PROPERTY_ID = uuid();
const MOCK_ALARM_INPUT_PROPERTY_NAME = 'Rotation';

const MOCK_ALARM_MODEL_NAME = 'rotationSpeedAlarmModel';
const MOCK_ALARM_MODEL_ARN = `arn:aws:iotevents:us-east-1:123456789012:alarmModel/${MOCK_ALARM_MODEL_NAME}`;
const MOCK_THRESHOLD = 30;

const DEFAULT_REFRESH_RATE = 5000; // milliseconds

/**
 * Mock SiteWiseAlarmQuery
 *
 * Uses mock SiteWise and Events clients that return deterministic alarm data.
 *
 * Builds a TimeSeriesDataQuery for the alarm input property to match the
 * alarm data values.
 */
export const mockAlarmData = (refreshRate = DEFAULT_REFRESH_RATE) => {
  const iotSiteWiseClient = {
    describeAsset: mockDescribeAsset,
    // Omit batch APIs to enforce using non-batch APIs which are easier to mock
    getAssetPropertyValue: mockGetAssetPropertyValue,
    getAssetPropertyValueHistory: mockGetAssetPropertyValueHistory,
  } as IoTSiteWise;

  const iotEventsClient = {
    describeAlarmModel: mockDescribeAlarmModel,
  } as IoTEvents;

  // Expected delimiter for the datastream id
  const DATASTREAM_ID_DELIMITER = '---';
  const inputPropertyDataStreamId = `${MOCK_ALARM_ASSET_ID}${DATASTREAM_ID_DELIMITER}${MOCK_ALARM_INPUT_PROPERTY_ID}`;

  return {
    query: {
      alarms: [
        {
          assetId: MOCK_ALARM_ASSET_ID,
          alarmComponents: [
            {
              assetCompositeModelId: MOCK_ALARM_COMPOSITE_MODEL_ID,
            },
          ],
        },
      ],
      requestSettings: {
        refreshRate,
      },
    },
    iotSiteWiseClient,
    iotEventsClient,
    timeSeriesData: () =>
      mockTimeSeriesDataQueryLiveStreamAggregated({
        refreshRate,
        resolution: 1000,
        dataType: DATA_TYPE.NUMBER,
        requests: [
          {
            name: MOCK_ALARM_INPUT_PROPERTY_NAME,
            createDataPoint: (date: Date) => {
              /**
               * We make sure the mocked alarm state data matches the mocked input property data
               * by rounding the date to the nearest second since both should be fetched around
               * the same time.
               */
              const roundedDate = new Date(date.setMilliseconds(0));
              return {
                x: roundedDate.getTime(),
                y: mockSinWaveDataValue(roundedDate),
              };
            },
          },
        ],
        id: inputPropertyDataStreamId,
      }),
  };
};

/**
 * SiteWise DescribeAsset function mock
 */
const mockDescribeAsset = (
  _: DescribeAssetCommandInput
): Promise<DescribeAssetResponse> => {
  return new Promise((resolve, _) =>
    resolve({
      assetId: MOCK_ALARM_ASSET_ID,
      assetArn: `arn:aws:iotsitewise:us-east-1:123456789012:asset/${MOCK_ALARM_ASSET_ID}`,
      assetName: 'Windmill',
      assetModelId: MOCK_ALARM_ASSET_MODEL_ID,
      assetProperties: [
        {
          id: MOCK_ALARM_INPUT_PROPERTY_ID,
          name: MOCK_ALARM_INPUT_PROPERTY_NAME,
          dataType: 'DOUBLE',
          unit: 'rpm',
        },
      ],
      assetHierarchies: [],
      assetCompositeModels: [
        {
          id: MOCK_ALARM_COMPOSITE_MODEL_ID,
          name: MOCK_ALARM_NAME,
          type: ALARM_COMPOSITE_MODEL_TYPE,
          properties: [
            {
              id: MOCK_ALARM_STATE_PROPERTY_ID,
              name: ALARM_STATE_PROPERTY_NAME,
              dataType: 'STRING',
            },
            {
              id: MOCK_ALARM_TYPE_PROPERTY_ID,
              name: ALARM_TYPE_PROPERTY_NAME,
              dataType: 'STRING',
            },
            {
              id: MOCK_ALARM_SOURCE_PROPERTY_ID,
              name: ALARM_SOURCE_PROPERTY_NAME,
              dataType: 'STRING',
            },
          ],
        },
      ],
      assetCreationDate: new Date(),
      assetLastUpdateDate: new Date(),
      assetStatus: {
        state: 'ACTIVE',
      },
    })
  );
};

/**
 * IoT Events DescribeAlarmModel function mock
 */
const mockDescribeAlarmModel = (
  _: DescribeAlarmModelCommandInput
): Promise<DescribeAlarmModelResponse> => {
  return new Promise((resolve, _) =>
    resolve({
      alarmModelArn: MOCK_ALARM_MODEL_ARN,
      alarmModelVersion: '1',
      lastUpdateTime: new Date(),
      status: 'ACTIVE',
      alarmModelName: MOCK_ALARM_MODEL_NAME,
      severity: 1,
      alarmRule: {
        simpleRule: {
          inputProperty: `$sitewise.assetModel.\`${MOCK_ALARM_ASSET_MODEL_ID}\`.\`${MOCK_ALARM_INPUT_PROPERTY_ID}\`.propertyValue.value`,
          comparisonOperator: 'GREATER',
          threshold: `${MOCK_THRESHOLD}`,
        },
      },
    })
  );
};

// Mock alarm state property value
const generateAlarmState = ({
  alarmState,
  inputPropertyValue,
}: {
  alarmState: string;
  inputPropertyValue: number;
}) => {
  return `{"stateName":"${alarmState}","ruleEvaluation":{"simpleRule":{"inputProperty": ${inputPropertyValue},"operator":"GREATER","threshold":${MOCK_THRESHOLD}}}}`;
};

/**
 * Store the latest alarm state.
 * Only a new alarm state value should be returned in alarm property history.
 */
let lastAlarmState = '';

/**
 * SiteWise GetAssetPropertyValueHistory function mock
 * Generates an alarm state property value history based on the input endDate
 */
const mockGetAssetPropertyValueHistory = (
  input: GetAssetPropertyValueHistoryCommandInput
): Promise<GetAssetPropertyValueHistoryResponse> => {
  const date = input.endDate ?? new Date();

  /**
   * Real alarm state is based on a rule evaluated for an input property value.
   * This mocked alarm state value is based on the date time.
   *
   * We make sure the mocked alarm state data matches the mocked input property data
   * by rounding the date to the nearest second since both should be fetched around
   * the same time.
   */
  const roundedDate = new Date(date.setMilliseconds(0));
  const inputPropertyValue = mockSinWaveDataValue(roundedDate);
  const alarmState = inputPropertyValue > MOCK_THRESHOLD ? 'ACTIVE' : 'NORMAL';

  const assetPropertyValueHistory: AssetPropertyValue[] = [];
  if (alarmState !== lastAlarmState) {
    assetPropertyValueHistory.push({
      value: {
        stringValue: generateAlarmState({ alarmState, inputPropertyValue }),
      },
      timestamp: {
        timeInSeconds: Math.floor(roundedDate.getTime() / 1000),
      },
    });
    lastAlarmState = alarmState;
  }
  // Use setTimeout to ensure tanstack query state changes
  return new Promise((resolve, _) => {
    setTimeout(
      () => resolve({ assetPropertyValueHistory: assetPropertyValueHistory }),
      1
    );
  });
};

/**
 * SiteWise GetAssetPropertyValue function mock
 * Generates a property value based on the alarm property
 */
const mockGetAssetPropertyValue = (
  input: GetAssetPropertyValueCommandInput
): Promise<GetAssetPropertyValueResponse> => {
  const date = new Date();
  const roundedDate = new Date(date.setMilliseconds(0));
  const timestamp: TimeInNanos = {
    timeInSeconds: Math.floor(roundedDate.getTime() / 1000),
  };

  return new Promise((resolve, _) => {
    let propertyValue: AssetPropertyValue | undefined;
    switch (input.propertyId) {
      case MOCK_ALARM_TYPE_PROPERTY_ID: {
        propertyValue = {
          value: {
            stringValue: 'IOT_EVENTS',
          },
          timestamp,
        };
        break;
      }
      case MOCK_ALARM_SOURCE_PROPERTY_ID: {
        propertyValue = {
          value: {
            stringValue: `arn:aws:iotevents:us-east-1:123456789012:alarmModel/${MOCK_ALARM_MODEL_NAME}`,
          },
          timestamp,
        };
        break;
      }
      case MOCK_ALARM_STATE_PROPERTY_ID: {
        const inputPropertyValue = mockSinWaveDataValue(roundedDate);
        const alarmState =
          inputPropertyValue > MOCK_THRESHOLD ? 'ACTIVE' : 'NORMAL';
        propertyValue = {
          value: {
            stringValue: generateAlarmState({ alarmState, inputPropertyValue }),
          },
          timestamp,
        };
        break;
      }
    }
    resolve({ propertyValue });
  });
};
