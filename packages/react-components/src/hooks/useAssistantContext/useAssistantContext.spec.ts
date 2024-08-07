import { inflate } from 'pako';
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

    const binaryString1 = atob(getContextByComponent(component1));
    const binaryData1 = new Uint8Array(
      [...binaryString1].map((x) => x.charCodeAt(0))
    );
    const expectedContext1 = inflate(binaryData1, { to: 'string' });

    const binaryString2 = atob(getContextByComponent(component2));
    const binaryData2 = new Uint8Array(
      [...binaryString2].map((x) => x.charCodeAt(0))
    );
    const expectedContext2 = inflate(binaryData2, { to: 'string' });

    expect(expectedContext1).toBe(JSON.stringify(context1));
    expect(expectedContext2).toBe(JSON.stringify(context2));
  });

  it('getAllAssistantContext should get all assistant contexts', () => {
    const { getAllAssistantContext, setContextByComponent } =
      useAssistantContext();
    setContextByComponent(component1, context1);
    setContextByComponent(component2, context2);

    const binaryString = atob(getAllAssistantContext());
    const binaryData = new Uint8Array(
      [...binaryString].map((x) => x.charCodeAt(0))
    );
    const expectedContext = inflate(binaryData, { to: 'string' });

    expect(expectedContext).toBe(
      JSON.stringify({
        mockComponent: context1,
        testComponent: context2,
      })
    );
  });
});
