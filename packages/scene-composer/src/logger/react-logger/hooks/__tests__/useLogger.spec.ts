import useLogger from '../useLogger';

const extend = jest.fn();

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn().mockImplementation(() => ({
    log: {
      extend: extend,
    },
  })),
  useMemo: jest.fn().mockImplementation((f: any) => {
    f();
  }),
}));

describe('useLogger Hook', () => {
  afterEach(() => {
    extend.mockReset();
  });

  it('should allow consumer to extend the namespace', () => {
    useLogger('extended');

    expect(extend).toBeCalledWith('extended');
  });

  it('should allow consumer to just use current logger', () => {
    useLogger();

    expect(extend).not.toBeCalled();
  });
});
