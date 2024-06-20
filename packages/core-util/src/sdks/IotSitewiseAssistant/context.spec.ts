import assitantContext, { setContext, appendContext } from './context';

describe('Assistant Context', () => {

  it('should provide a global context initiated as default', () => {
    expect(assitantContext).toBeDefined();
    expect(assitantContext).not.toBeNull();
    expect(assitantContext.getState().context).toBe('');
  });

  it('setContext should set a new assistant global context', () => {
    const context = 'new context passed';
    setContext(context);
    expect(assitantContext.getState().context).toBe(context);
  });

  it('appendContext should append to the end a new context to the global context', () => {
    const initialContext = 'initial context';
    const contextToAppend = 'appended context';
    setContext(initialContext);
    appendContext(contextToAppend);
    expect(assitantContext.getState().context).toBe(`${initialContext}${contextToAppend}`);
  });
});
