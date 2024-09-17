import type { TimeSeriesDataQuery } from '@iot-app-kit/core';
import { useAssistantContext } from './useAssistantContext';
import type { SiteWiseDataStreamQuery } from '@iot-app-kit/source-iotsitewise';
import { AggregateType } from '@aws-sdk/client-iotsitewise';

const component1 = 'mockComponent';
const component2 = 'testComponent';
const context1 = { initial: 'initial context' };
const context2 = { new: 'new context' };
const context3 = { new: 'updated context' };

export const mockTimeSeriesDataQuery = (
  mockData: SiteWiseDataStreamQuery
): TimeSeriesDataQuery => {
  return {
    toQueryString: () =>
      JSON.stringify({
        source: 'mock',
        queryType: 'time-series-data',
        query: mockData,
      }),
    build: () => ({
      subscribe: () => {},
      unsubscribe: () => {},
      updateViewport: () => {},
    }),
  };
};

describe('useAssistantContext', () => {
  it('should provide a global context already initiated', () => {
    const { assistantContext } = useAssistantContext();
    expect(assistantContext).toBeDefined();
    expect(assistantContext).not.toBeNull();
    expect(assistantContext.getState().context).toStrictEqual({});
  });

  it('setContextByComponent should set a new assistant global context', () => {
    const { setContextByComponent, assistantContext } = useAssistantContext();
    setContextByComponent(component1, context1);
    expect(assistantContext.getState().context[component1]).toStrictEqual(
      context1
    );
  });

  it('updateContextByComponent should append to the end a new context to the global context', () => {
    const {
      assistantContext,
      setContextByComponent,
      updateContextByComponent,
    } = useAssistantContext();
    setContextByComponent(component1, context1);
    updateContextByComponent(component1, context2);
    expect(assistantContext.getState().context[component1]).toStrictEqual({
      ...context1,
      ...context2,
    });
  });

  it('updateContextByComponent should replace existing context with updated data', () => {
    const {
      assistantContext,
      setContextByComponent,
      updateContextByComponent,
    } = useAssistantContext();
    setContextByComponent(component1, context1);
    updateContextByComponent(component1, context2);
    updateContextByComponent(component1, context3);
    expect(assistantContext.getState().context[component1]).toStrictEqual({
      ...context1,
      ...context3,
    });
  });

  it('getContextByComponent should get context for a single component', () => {
    const { getContextByComponent, setContextByComponent } =
      useAssistantContext();
    setContextByComponent(component1, context1);
    setContextByComponent(component2, context2);

    expect(getContextByComponent(component1)).toBe(JSON.stringify(context1));
    expect(getContextByComponent(component2)).toBe(JSON.stringify(context2));
  });

  it('getAllAssistantContext should get all assistant contexts', () => {
    const { getAllAssistantContext, setContextByComponent } =
      useAssistantContext();
    setContextByComponent(component1, context1);
    setContextByComponent(component2, context2);

    expect(getAllAssistantContext()).toBe(
      JSON.stringify({
        mockComponent: context1,
        testComponent: context2,
      })
    );
  });

  it('transformTimeseriesToAssistantContext should return start and end dates in ISO 8601 format', () => {
    const { transformTimeseriesDataToAssistantContext } = useAssistantContext();
    const start = new Date('August 01, 2024 05:35:32');
    const end = new Date('September 06, 2024 23:12:34');

    const transformed = transformTimeseriesDataToAssistantContext({
      start,
      end,
      queries: [],
    });
    expect(transformed.timerange.start).toBe('2024-08-01T05:35:32Z');
    expect(transformed.timerange.end).toBe('2024-09-06T23:12:34Z');
  });

  it('transformTimeseriesToAssistantContext should return parse and return query in a correct format to be added to te assistant context', () => {
    const { transformTimeseriesDataToAssistantContext } = useAssistantContext();
    const start = new Date('August 01, 2024 05:35:32');
    const end = new Date('September 06, 2024 23:12:34');
    const timeSeriesData: SiteWiseDataStreamQuery = {
      assets: [
        {
          assetId: 'assetId',
          properties: [
            {
              aggregationType: AggregateType.MAXIMUM,
              propertyId: 'propertyId1',
            },
            {
              aggregationType: AggregateType.MAXIMUM,
              propertyId: 'propertyId2',
            },
          ],
        },
      ],
      properties: [
        {
          aggregationType: AggregateType.MAXIMUM,
          propertyAlias: 'propertyAlias1',
        },
        {
          aggregationType: AggregateType.MAXIMUM,
          propertyAlias: 'propertyAlias2',
        },
      ],
    };
    const query = mockTimeSeriesDataQuery(timeSeriesData);

    const transformed = transformTimeseriesDataToAssistantContext({
      start,
      end,
      queries: [query],
    });
    const [first] = transformed.queries;
    expect(first?.queryType).toEqual('time-series-data');
    expect(first?.aggregationType).toEqual(AggregateType.MAXIMUM);
    expect(first?.properties[0].propertyId).toEqual('propertyId1');
    expect(first?.properties[1].propertyId).toEqual('propertyId2');
    expect(first?.properties[2].propertyAlias).toEqual('propertyAlias1');
    expect(first?.properties[3].propertyAlias).toEqual('propertyAlias2');
  });
});
