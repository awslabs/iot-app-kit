import { add, sub } from 'date-fns';
import {
  mockAlarmDataDescribeAsset,
  mockAlarmDataDescribeAsset2,
  mockDefaultAlarmState,
  mockDefaultAlarmState2,
  mockStringAssetPropertyValue,
} from '../../../../../testing/alarms';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';
import { AlarmsState } from '../../types';
import { updateAlarmStateData } from './updateAlarmStateData';

const date = new Date(1728674795974);
const viewport = {
  start: sub(date, { hours: 1 }),
  end: add(date, { hours: 1 }),
};

const normalAssetPropertyValue = mockStringAssetPropertyValue(
  mockDefaultAlarmState,
  date
);

const activeAssetPropertyValue = mockStringAssetPropertyValue(
  mockDefaultAlarmState2,
  date
);

describe('updateAlarmStateData', () => {
  it('sets alarm state data', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [mockAlarmDataDescribeAsset, mockAlarmDataDescribeAsset2],
        },
      ],
    } satisfies AlarmsState;

    expect(
      updateAlarmStateData(state, {
        viewport,
        assetPropertyValueSummaries: [
          {
            request: {
              assetId: mockAlarmDataDescribeAsset.assetId,
              propertyId: mockAlarmDataDescribeAsset.state.property.id,
            },
            data: [normalAssetPropertyValue],
            status: mockSuccessStatus,
          },
          {
            request: {
              assetId: mockAlarmDataDescribeAsset2.assetId,
              propertyId: mockAlarmDataDescribeAsset2.state.property.id,
            },
            data: [activeAssetPropertyValue],
            status: mockSuccessStatus,
          },
        ],
      })
    ).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              state: {
                property: mockAlarmDataDescribeAsset.state.property,
                data: [normalAssetPropertyValue],
              },
            },
            {
              state: {
                property: mockAlarmDataDescribeAsset2.state.property,
                data: [activeAssetPropertyValue],
              },
            },
          ],
        },
      ],
    });
  });

  it('does not set anything if there is no alarm data state or summary', async () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockLoadingStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [{}],
        },
      ],
    } satisfies AlarmsState;

    expect(
      updateAlarmStateData(state, {
        viewport,
        assetPropertyValueSummaries: [],
      })
    ).toBe(state);

    expect(
      updateAlarmStateData(state, {
        viewport,
        assetPropertyValueSummaries: [
          {
            request: {
              assetId: mockAlarmDataDescribeAsset.assetId,
              propertyId: mockAlarmDataDescribeAsset.state.property.id,
            },
            data: [normalAssetPropertyValue],
            status: mockSuccessStatus,
          },
        ],
      })
        .alarms.at(0)
        ?.alarmDatas.at(0)
    ).toBe(state.alarms.at(0)?.alarmDatas.at(0));

    const stateWithDifferentStateProperty = {
      alarms: [
        {
          describeAssetQueryStatus: mockLoadingStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [mockAlarmDataDescribeAsset2],
        },
      ],
    } satisfies AlarmsState;

    expect(
      updateAlarmStateData(stateWithDifferentStateProperty, {
        viewport,
        assetPropertyValueSummaries: [
          {
            request: {
              assetId: mockAlarmDataDescribeAsset.assetId,
              propertyId: mockAlarmDataDescribeAsset.state.property.id,
            },
            data: [normalAssetPropertyValue],
            status: mockSuccessStatus,
          },
        ],
      })
        .alarms.at(0)
        ?.alarmDatas.at(0)
    ).toBe(stateWithDifferentStateProperty.alarms.at(0)?.alarmDatas.at(0));
  });

  it('is referentially equal if there is no new data.', async () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [mockAlarmDataDescribeAsset, mockAlarmDataDescribeAsset2],
        },
      ],
    } satisfies AlarmsState;

    const updatedState = updateAlarmStateData(state, {
      viewport,
      assetPropertyValueSummaries: [
        {
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
            propertyId: mockAlarmDataDescribeAsset.state.property.id,
          },
          data: [normalAssetPropertyValue],
          status: mockSuccessStatus,
        },
        {
          request: {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            propertyId: mockAlarmDataDescribeAsset2.state.property.id,
          },
          data: [activeAssetPropertyValue],
          status: mockSuccessStatus,
        },
      ],
    });

    const updatedWithSameSummaries = updateAlarmStateData(updatedState, {
      viewport,
      assetPropertyValueSummaries: [
        {
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
            propertyId: mockAlarmDataDescribeAsset.state.property.id,
          },
          data: [normalAssetPropertyValue],
          status: mockSuccessStatus,
        },
        {
          request: {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            propertyId: mockAlarmDataDescribeAsset2.state.property.id,
          },
          data: [activeAssetPropertyValue],
          status: mockSuccessStatus,
        },
      ],
    });

    expect(updatedState.alarms.at(0)?.alarmDatas.at(0)?.state?.data).toBe(
      updatedWithSameSummaries.alarms.at(0)?.alarmDatas.at(0)?.state?.data
    );
    expect(updatedState.alarms.at(0)?.alarmDatas.at(1)?.state?.data).toBe(
      updatedWithSameSummaries.alarms.at(0)?.alarmDatas.at(1)?.state?.data
    );
  });

  it('is referentially equal if there is no new data within a viewport.', async () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [mockAlarmDataDescribeAsset, mockAlarmDataDescribeAsset2],
        },
      ],
    } satisfies AlarmsState;

    const updatedState = updateAlarmStateData(state, {
      viewport,
      assetPropertyValueSummaries: [
        {
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
            propertyId: mockAlarmDataDescribeAsset.state.property.id,
          },
          data: [normalAssetPropertyValue],
          status: mockSuccessStatus,
        },
        {
          request: {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            propertyId: mockAlarmDataDescribeAsset2.state.property.id,
          },
          data: [activeAssetPropertyValue],
          status: mockSuccessStatus,
        },
      ],
    });

    const updatedViewport = {
      start: sub(viewport.start, { hours: 1 }),
      end: add(viewport.start, { hours: 1 }),
    };
    const updatedWithSameSummaries = updateAlarmStateData(updatedState, {
      viewport: updatedViewport,
      assetPropertyValueSummaries: [
        {
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
            propertyId: mockAlarmDataDescribeAsset.state.property.id,
          },
          data: [normalAssetPropertyValue],
          status: mockSuccessStatus,
        },
        {
          request: {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            propertyId: mockAlarmDataDescribeAsset2.state.property.id,
          },
          data: [activeAssetPropertyValue],
          status: mockSuccessStatus,
        },
      ],
    });

    expect(updatedState.alarms.at(0)?.alarmDatas.at(0)?.state?.data).toBe(
      updatedWithSameSummaries.alarms.at(0)?.alarmDatas.at(0)?.state?.data
    );
    expect(updatedState.alarms.at(0)?.alarmDatas.at(1)?.state?.data).toBe(
      updatedWithSameSummaries.alarms.at(0)?.alarmDatas.at(1)?.state?.data
    );
  });
});
