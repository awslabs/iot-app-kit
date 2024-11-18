import {
  getAssistantStore,
  getAllAssistantContext,
  getContextByComponent,
  setContextByComponent,
  updateContextByComponent,
  getRawContextByComponent,
} from './context';

const component1 = 'mockComponent';
const component2 = 'testComponent';
const context1 = { initial: 'initial context' };
const context2 = { new: 'new context' };
const context3 = { new: 'updated context' };

describe('Assistant Context', () => {
  it('should provide a global context initiated as default', () => {
    const assistantStore = getAssistantStore();
    expect(assistantStore).toBeDefined();
    expect(assistantStore).not.toBeNull();
    expect(assistantStore.getState().context).toStrictEqual({});
  });

  it('setContextByComponent should set a new assistant global context', () => {
    const assistantStore = getAssistantStore();
    setContextByComponent(component1, context1);
    expect(assistantStore.getState().context[component1]).toStrictEqual(
      context1
    );
  });

  it('updateContextByComponent should append to the end a new context to the global context', () => {
    const assistantStore = getAssistantStore();
    setContextByComponent(component1, context1);
    updateContextByComponent(component1, context2);
    expect(assistantStore.getState().context[component1]).toStrictEqual({
      ...context1,
      ...context2,
    });
  });

  it('updateContextByComponent should replace existing context with updated data', () => {
    const assistantStore = getAssistantStore();
    setContextByComponent(component1, context1);
    updateContextByComponent(component1, context2);
    updateContextByComponent(component1, context3);
    expect(assistantStore.getState().context[component1]).toStrictEqual({
      ...context1,
      ...context3,
    });
  });

  it('getContextByComponent should get context for a single component', () => {
    getAssistantStore();
    setContextByComponent(component1, context1);
    setContextByComponent(component2, context2);
    expect(getContextByComponent(component1)).toBe(JSON.stringify(context1));
    expect(getContextByComponent(component2)).toBe(JSON.stringify(context2));
  });

  it('getAllAssistantContext should get all assistant contexts', () => {
    getAssistantStore();
    setContextByComponent(component1, context1);
    setContextByComponent(component2, context2);
    expect(getAllAssistantContext()).toBe(
      JSON.stringify({
        mockComponent: context1,
        testComponent: context2,
      })
    );
  });

  it('getRawContextByComponent should get context for a single component', () => {
    getAssistantStore();
    setContextByComponent(component1, context1);
    expect(getRawContextByComponent(component1)).toEqual(context1);
  });
});
