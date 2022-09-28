import debug from 'debug';

import DebugLogger from '../DebugLogger';

jest.mock('debug');

describe('DebugLogger', () => {
  it('should create a new debug instance if initialized with a namespace', () => {
    const namespace = 'foobar';

    // Act
    // eslint-disable-next-line no-new
    new DebugLogger(namespace);

    expect(debug).toBeCalledWith(namespace);
  });

  it('should extend the debug namespace when extended, and return a new DebugLogger', () => {
    const debugLogger = {
      extend: jest.fn(() => jest.fn),
    } as unknown as debug.Debugger;

    const childNamespace = 'childNamespace';
    const sut = new DebugLogger(debugLogger);

    const result = sut.extend(childNamespace);

    expect(result).not.toBe(sut);
    expect(debugLogger.extend).toBeCalledWith(childNamespace);
  });

  ['warn', 'error', 'fatal', 'info', 'verbose'].forEach((level) => {
    it(`should extend the namespace to include ${level} for easy filtering`, async () => {
      const debugLogger = {
        extend: jest.fn(() => jest.fn),
      } as unknown as debug.Debugger;

      const message = 'foobar';
      const sut = new DebugLogger(debugLogger);

      await (sut as any)[level](message);

      expect(debugLogger.extend).toBeCalledWith(`[${level.toUpperCase()}]`);
    });
  });
});
