import { renderHook } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';

import { cloneDeep } from 'lodash';

import { DataStream } from '@iot-app-kit/core';
import { toId } from '@iot-app-kit/source-iotsitewise';

import { useInputPropertyTimeSeriesData } from './useInputPropertyTimeSeriesData';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ALARM_INPUT_PROPERTY_ID_2,
  MOCK_ASSET_ID,
  mockAlarmDataWithInputProperty,
  mockAlarmDataWithInputProperty2,
} from '../../../../testing/alarms';
import { UseInputPropertyTimeSeriesDataOptions } from './types';

const TEST_REFRESH_RATE = 5000;

const TEST_DATASTREAM_1 = {
  id: toId({
    assetId: MOCK_ASSET_ID,
    propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
  }),
  data: [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 3, y: 3 },
  ],
  dataType: 'NUMBER',
  resolution: 0,
} satisfies DataStream;

const TEST_DATASTREAM_2 = {
  id: toId({
    assetId: MOCK_ASSET_ID,
    propertyId: MOCK_ALARM_INPUT_PROPERTY_ID_2,
  }),
  data: [
    { x: 10, y: 1 },
    { x: 11, y: 2 },
    { x: 13, y: 3 },
  ],
  dataType: 'NUMBER',
  resolution: 0,
} satisfies DataStream;

describe('useInputPropertyTimeSeriesData', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('fetches time series data for an input property.', async () => {
    const testViewport = { duration: '1m' };
    const timeSeriesDataMock = jest.fn();
    timeSeriesDataMock.mockReturnValue(
      mockTimeSeriesDataQuery([
        {
          dataStreams: [TEST_DATASTREAM_1, TEST_DATASTREAM_2],
          viewport: testViewport,
          thresholds: [],
        },
      ])
    );

    const { result } = renderHook(() =>
      useInputPropertyTimeSeriesData({
        alarms: [
          cloneDeep(mockAlarmDataWithInputProperty),
          cloneDeep(mockAlarmDataWithInputProperty2),
        ],
        timeSeriesData: timeSeriesDataMock,
        refreshRate: TEST_REFRESH_RATE,
        fetchInputPropertyData: true,
        viewport: testViewport,
        aggregationType: 'AVERAGE',
        resolution: undefined,
      })
    );

    expect(timeSeriesDataMock).toHaveBeenCalledWith({
      assets: [
        {
          assetId: MOCK_ASSET_ID,
          properties: [
            {
              propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
              aggregationType: 'AVERAGE',
              resolution: undefined,
            },
            {
              propertyId: MOCK_ALARM_INPUT_PROPERTY_ID_2,
              aggregationType: 'AVERAGE',
              resolution: undefined,
            },
          ],
        },
      ],
    });

    expect(result.current[0].inputProperty?.at(0)?.dataStream).toEqual(
      expect.objectContaining(TEST_DATASTREAM_1)
    );
    expect(result.current[1].inputProperty?.at(0)?.dataStream).toEqual(
      expect.objectContaining(TEST_DATASTREAM_2)
    );
  });

  it('does not fetch time series data if the required properties are not provided', async () => {
    const testViewport = { duration: '1m' };
    const timeSeriesDataMock = jest.fn();

    const { result, rerender } = renderHook(
      (
        {
          timeSeriesData,
          fetchInputPropertyData,
          viewport,
        }: Pick<
          UseInputPropertyTimeSeriesDataOptions,
          'timeSeriesData' | 'fetchInputPropertyData' | 'viewport'
        > = {
          timeSeriesData: timeSeriesDataMock,
          fetchInputPropertyData: false,
          viewport: testViewport,
        }
      ) =>
        useInputPropertyTimeSeriesData({
          alarms: [
            cloneDeep(mockAlarmDataWithInputProperty),
            cloneDeep(mockAlarmDataWithInputProperty2),
          ],
          timeSeriesData,
          refreshRate: TEST_REFRESH_RATE,
          fetchInputPropertyData,
          viewport,
        })
    );

    expect(timeSeriesDataMock).not.toHaveBeenCalled();

    expect(result.current[0].inputProperty?.at(0)?.dataStream).toBeUndefined();
    expect(result.current[1].inputProperty?.at(0)?.dataStream).toBeUndefined();

    rerender({
      fetchInputPropertyData: true,
      timeSeriesData: undefined,
    });

    expect(timeSeriesDataMock).not.toHaveBeenCalled();

    expect(result.current[0].inputProperty?.at(0)?.dataStream).toBeUndefined();
    expect(result.current[1].inputProperty?.at(0)?.dataStream).toBeUndefined();

    rerender({
      fetchInputPropertyData: true,
      viewport: undefined,
    });

    expect(timeSeriesDataMock).not.toHaveBeenCalled();

    expect(result.current[0].inputProperty?.at(0)?.dataStream).toBeUndefined();
    expect(result.current[1].inputProperty?.at(0)?.dataStream).toBeUndefined();
  });
});
