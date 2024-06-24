import { useAssistantContext } from './useAssistantContext';

describe('useAssistantContext', () => {
  it('should provide a global context already initiated', () => {
    const { assistantContext } = useAssistantContext();
    expect(assistantContext).toBeDefined();
    expect(assistantContext).not.toBeNull();
    expect(assistantContext.getState().context).toBe('');
  });

  it('setContext should set a new assistant global context', () => {
    const { setContext, assistantContext } = useAssistantContext();
    const context = 'new context passed';
    setContext(context);
    expect(assistantContext.getState().context).toBe(context);
  });

  it('appendContext should append to the end a new context to the global context', () => {
    const { assistantContext, setContext, appendContext } =
      useAssistantContext();
    const initialContext = 'initial context';
    const contextToAppend = 'appended context';
    setContext(initialContext);
    appendContext(contextToAppend);
    expect(assistantContext.getState().context).toBe(
      `${initialContext}${contextToAppend}`
    );
  });
});
