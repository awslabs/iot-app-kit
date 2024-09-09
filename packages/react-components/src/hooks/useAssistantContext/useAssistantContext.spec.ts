import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { useAssistantContext } from './useAssistantContext';

const component1 = 'mockComponent';
const component2 = 'testComponent';
const context1 = { initial: 'initial context' };
const context2 = { new: 'new context' };
const context3 = { new: 'updated context' };

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

  it('getSupportedTimeRange should return start and end dates in ISO 8601 format', () => {
    const { getSupportedTimeRange } = useAssistantContext();
    const startDate = new Date('August 01, 2024 05:35:32');
    const endDate = new Date('September 06, 2024 23:12:34');

    const timerange = getSupportedTimeRange(startDate, endDate);
    expect(timerange.start).toBe('2024-08-01T05:35:32.000Z');
    expect(timerange.end).toBe('2024-09-06T23:12:34.000Z');
  });

  it('getQueriesForContext should return parse and return query in a correct format to be added to te assistant context', () => {
    const { getQueriesForContext } = useAssistantContext();
    const anyQuery = {
      dataStreams: [],
      viewport: { duration: '5m' },
      thresholds: [],
    };
    const query = mockTimeSeriesDataQuery([anyQuery]);

    const [first] = getQueriesForContext([query]);
    expect(first).toEqual(
      expect.objectContaining({
        query: [
          { dataStreams: [], thresholds: [], viewport: { duration: '5m' } },
        ],
        source: 'mock',
      })
    );
  });
});
