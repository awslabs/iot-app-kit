import {
  MOCK_ALARM_MODEL_NAME,
  MOCK_ALARM_MODEL_NAME_2,
  MOCK_ASSET_ID,
  mockAlarmDataGetAssetPropertyValue,
  mockAlarmDataGetAssetPropertyValue2,
  mockAlarmModel,
  mockAlarmModel2,
  mockAssetModelProperties,
  mockInputProperty,
  mockInputProperty2,
} from '../../../../../testing/alarms';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';
import { type AlarmsState } from '../../types';
import { summarizeAlarmModels } from './summarizeAlarmModels';

describe('summarizeAlarmModels', () => {
  it('sets the models for an alarm', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: MOCK_ASSET_ID,
          },
          alarmDatas: [
            mockAlarmDataGetAssetPropertyValue,
            mockAlarmDataGetAssetPropertyValue2,
          ],
        },
      ],
    } satisfies AlarmsState;

    expect(
      summarizeAlarmModels(state, {
        alarmModelSummaries: [
          {
            request: { alarmModelName: MOCK_ALARM_MODEL_NAME },
            status: mockSuccessStatus,
            data: mockAlarmModel,
          },
          {
            request: { alarmModelName: MOCK_ALARM_MODEL_NAME_2 },
            status: mockSuccessStatus,
            data: mockAlarmModel2,
          },
        ],
      })
    ).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              models: [mockAlarmModel],
            },
            {
              models: [mockAlarmModel2],
            },
          ],
        },
      ],
    });
  });

  it('sets the input property for an alarm', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: MOCK_ASSET_ID,
          },
          alarmDatas: [
            {
              ...mockAlarmDataGetAssetPropertyValue,
              properties: [mockInputProperty, ...mockAssetModelProperties],
            },
            {
              ...mockAlarmDataGetAssetPropertyValue2,
              properties: [mockInputProperty2, ...mockAssetModelProperties],
            },
          ],
        },
      ],
    } satisfies AlarmsState;

    expect(
      summarizeAlarmModels(state, {
        alarmModelSummaries: [
          {
            request: { alarmModelName: MOCK_ALARM_MODEL_NAME },
            status: mockSuccessStatus,
            data: mockAlarmModel,
          },
          {
            request: { alarmModelName: MOCK_ALARM_MODEL_NAME_2 },
            status: mockSuccessStatus,
            data: mockAlarmModel2,
          },
        ],
      })
    ).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              inputProperty: [
                {
                  property: mockInputProperty,
                },
              ],
            },
            {
              inputProperty: [
                {
                  property: mockInputProperty2,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('filters alarm datas not associated with the request input property', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            inputPropertyId: mockInputProperty.id,
            assetId: MOCK_ASSET_ID,
          },
          alarmDatas: [
            {
              ...mockAlarmDataGetAssetPropertyValue,
              properties: [mockInputProperty, ...mockAssetModelProperties],
            },
            {
              ...mockAlarmDataGetAssetPropertyValue2,
              properties: [mockInputProperty2, ...mockAssetModelProperties],
            },
          ],
        },
      ],
    } satisfies AlarmsState;

    const summarizedAlarmModels = summarizeAlarmModels(state, {
      alarmModelSummaries: [
        {
          request: { alarmModelName: MOCK_ALARM_MODEL_NAME },
          status: mockSuccessStatus,
          data: mockAlarmModel,
        },
        {
          request: { alarmModelName: MOCK_ALARM_MODEL_NAME_2 },
          status: mockSuccessStatus,
          data: mockAlarmModel2,
        },
      ],
    });

    expect(summarizedAlarmModels.alarms.at(0)?.alarmDatas).toBeArrayOfSize(1);
    expect(summarizedAlarmModels).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              inputProperty: [
                {
                  property: mockInputProperty,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('sets the loading states for the request', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: MOCK_ASSET_ID,
          },
          alarmDatas: [
            mockAlarmDataGetAssetPropertyValue,
            mockAlarmDataGetAssetPropertyValue2,
          ],
        },
      ],
    } satisfies AlarmsState;

    expect(
      summarizeAlarmModels(state, {
        alarmModelSummaries: [
          {
            request: { alarmModelName: MOCK_ALARM_MODEL_NAME },
            status: mockLoadingStatus,
            data: undefined,
          },
          {
            request: { alarmModelName: MOCK_ALARM_MODEL_NAME_2 },
            status: mockLoadingStatus,
            data: undefined,
          },
        ],
      })
    ).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              describeAlarmModelsQueryStatus: mockLoadingStatus,
            },
            {
              describeAlarmModelsQueryStatus: mockLoadingStatus,
            },
          ],
        },
      ],
    });
  });
});
