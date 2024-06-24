import {
  getAssistantContext,
  setAssistantContext,
  appendAssistantContext,
} from './context';

describe('Assistant Context', () => {
  it('should provide a global context initiated as default', () => {
    const assistantContext = getAssistantContext();
    expect(assistantContext).toBeDefined();
    expect(assistantContext).not.toBeNull();
    expect(assistantContext.getState().context).toBe('');
  });

  it('setContext should set a new assistant global context', () => {
    const context = 'new context passed';
    const assistantContext = getAssistantContext();
    setAssistantContext(context);
    expect(assistantContext.getState().context).toBe(context);
  });

  it('appendContext should append to the end a new context to the global context', () => {
    const assistantContext = getAssistantContext();
    const initialContext = 'initial context';
    const contextToAppend = 'appended context';
    setAssistantContext(initialContext);
    appendAssistantContext(contextToAppend);
    expect(assistantContext.getState().context).toBe(
      `${initialContext}${contextToAppend}`
    );
  });
});
