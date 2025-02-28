import {
  MOCK_ASSET_ID,
  MOCK_ASSET_MODEL_ID,
  mockAlarmCompositeModel,
  mockAlarmCompositeModel2,
  mockAlarmModelCompositeModel,
  mockAlarmModelCompositeModel2,
  mockAssetModelProperties,
  mockAssetProperties,
  mockSourceAssetModelProperty,
  mockStateAssetModelProperty,
  mockTypeAssetModelProperty,
} from '../../../../../testing/alarms';
import { summarizeAlarms } from './summarizeAlarms';
import { mockDescribeAssetResponse } from '../../../../../testing/alarms/mockDescribeAsset';
import { mockDescribeAssetModelResponse } from '../../../../../testing/alarms/mockDescribeAssetModel';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';

describe('summarizeAlarms', () => {
  it('handles creating no alarms for a request', () => {
    const mockedAssetResponse = mockDescribeAssetResponse();

    const summarizedAlarmState = summarizeAlarms(
      { alarms: [] },
      {
        assetSummaries: [
          {
            request: {
              assetId: MOCK_ASSET_ID,
            },
            data: mockedAssetResponse,
            status: mockSuccessStatus,
          },
        ],
      }
    );

    expect(summarizedAlarmState).toMatchObject({
      alarms: [
        {
          request: {
            assetId: MOCK_ASSET_ID,
          },
          describeAssetQueryStatus: mockSuccessStatus,
          alarmDatas: expect.toBeArrayOfSize(0),
        },
      ],
    });
  });

  it('should create alarm state from a describe asset query', () => {
    const assetProperties = [
      ...mockAssetProperties,
      mockStateAssetModelProperty,
      mockSourceAssetModelProperty,
      mockTypeAssetModelProperty,
    ];

    const mockedAssetResponse = mockDescribeAssetResponse({
      compositeModels: [mockAlarmCompositeModel, mockAlarmCompositeModel2],
      assetProperties,
    });

    const summarizedAlarmState = summarizeAlarms(
      { alarms: [] },
      {
        assetSummaries: [
          {
            request: {
              assetId: MOCK_ASSET_ID,
            },
            data: mockedAssetResponse,
            status: mockSuccessStatus,
          },
        ],
      }
    );

    expect(summarizedAlarmState).toMatchObject({
      alarms: [
        {
          request: {
            assetId: MOCK_ASSET_ID,
          },
          describeAssetQueryStatus: mockSuccessStatus,
          alarmDatas: [
            {
              compositeModelId: mockAlarmCompositeModel.id,
              compositeModelName: mockAlarmCompositeModel.name,
              assetId: MOCK_ASSET_ID,
              assetModelId: MOCK_ASSET_MODEL_ID,
              properties: assetProperties,
              state: {
                property: {
                  id: mockStateAssetModelProperty.id,
                  name: mockStateAssetModelProperty.name,
                },
              },
              source: {
                property: {
                  id: mockSourceAssetModelProperty.id,
                  name: mockSourceAssetModelProperty.name,
                },
              },
              type: {
                property: {
                  id: mockTypeAssetModelProperty.id,
                  name: mockTypeAssetModelProperty.name,
                },
              },
            },
            {
              compositeModelId: mockAlarmCompositeModel2.id,
              compositeModelName: mockAlarmCompositeModel2.name,
              assetId: MOCK_ASSET_ID,
              assetModelId: MOCK_ASSET_MODEL_ID,
              properties: assetProperties,
              state: {
                property: {
                  id: mockStateAssetModelProperty.id,
                  name: mockStateAssetModelProperty.name,
                },
              },
              source: {
                property: {
                  id: mockSourceAssetModelProperty.id,
                  name: mockSourceAssetModelProperty.name,
                },
              },
              type: {
                property: {
                  id: mockTypeAssetModelProperty.id,
                  name: mockTypeAssetModelProperty.name,
                },
              },
            },
          ],
        },
      ],
    });
  });

  it('should create alarm state from a describe asset model query', () => {
    const assetModelProperties = [
      ...mockAssetModelProperties,
      ...mockAlarmModelCompositeModel.properties,
    ];

    const mockedAssetModelResponse = mockDescribeAssetModelResponse({
      assetModelId: MOCK_ASSET_MODEL_ID,
      compositeModels: [
        mockAlarmModelCompositeModel,
        mockAlarmModelCompositeModel2,
      ],
      assetModelProperties,
    });

    const summarizedAlarmState = summarizeAlarms(
      { alarms: [] },
      {
        assetModelSummaries: [
          {
            request: {
              assetModelId: MOCK_ASSET_MODEL_ID,
            },
            data: mockedAssetModelResponse,
            status: mockSuccessStatus,
          },
        ],
      }
    );

    expect(summarizedAlarmState).toMatchObject({
      alarms: [
        {
          request: {
            assetModelId: MOCK_ASSET_MODEL_ID,
          },
          describeAssetModelQueryStatus: mockSuccessStatus,
          alarmDatas: [
            {
              compositeModelId: mockAlarmModelCompositeModel.id,
              compositeModelName: mockAlarmModelCompositeModel.name,
              assetModelId: MOCK_ASSET_MODEL_ID,
              properties: assetModelProperties,
              state: {
                property: {
                  id: mockStateAssetModelProperty.id,
                  name: mockStateAssetModelProperty.name,
                },
              },
              source: {
                property: {
                  id: mockSourceAssetModelProperty.id,
                  name: mockSourceAssetModelProperty.name,
                },
              },
              type: {
                property: {
                  id: mockTypeAssetModelProperty.id,
                  name: mockTypeAssetModelProperty.name,
                },
              },
            },
            {
              compositeModelId: mockAlarmModelCompositeModel2.id,
              compositeModelName: mockAlarmModelCompositeModel2.name,
              assetModelId: MOCK_ASSET_MODEL_ID,
              properties: assetModelProperties,
              state: {
                property: {
                  id: mockStateAssetModelProperty.id,
                  name: mockStateAssetModelProperty.name,
                },
              },
              source: {
                property: {
                  id: mockSourceAssetModelProperty.id,
                  name: mockSourceAssetModelProperty.name,
                },
              },
              type: {
                property: {
                  id: mockTypeAssetModelProperty.id,
                  name: mockTypeAssetModelProperty.name,
                },
              },
            },
          ],
        },
      ],
    });
  });

  it('should handle loading states for a request', () => {
    const assetModelProperties = [
      ...mockAssetModelProperties,
      ...mockAlarmModelCompositeModel.properties,
    ];

    const mockedAssetModelResponse = mockDescribeAssetModelResponse({
      assetModelId: MOCK_ASSET_MODEL_ID,
      compositeModels: [mockAlarmModelCompositeModel],
      assetModelProperties,
    });

    const summarizedAlarmStateLoading = summarizeAlarms(
      { alarms: [] },
      {
        assetModelSummaries: [
          {
            request: {
              assetModelId: MOCK_ASSET_MODEL_ID,
            },
            data: undefined,
            status: mockLoadingStatus,
          },
        ],
      }
    );

    expect(summarizedAlarmStateLoading).toMatchObject({
      alarms: [
        {
          request: {
            assetModelId: MOCK_ASSET_MODEL_ID,
          },
          describeAssetModelQueryStatus: mockLoadingStatus,
          alarmDatas: [],
        },
      ],
    });

    const summarizedAlarmState = summarizeAlarms(summarizedAlarmStateLoading, {
      assetModelSummaries: [
        {
          request: {
            assetModelId: MOCK_ASSET_MODEL_ID,
          },
          data: mockedAssetModelResponse,
          status: mockSuccessStatus,
        },
      ],
    });

    expect(summarizedAlarmState).toEqual({
      alarms: [
        {
          request: {
            assetModelId: MOCK_ASSET_MODEL_ID,
          },
          describeAssetModelQueryStatus: mockSuccessStatus,
          alarmDatas: expect.toBeArrayOfSize(1),
        },
      ],
    });
  });
});
