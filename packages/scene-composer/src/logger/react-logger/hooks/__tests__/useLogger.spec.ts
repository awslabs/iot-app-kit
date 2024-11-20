import useLogger from '../useLogger';

const extend = vi.fn();

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useContext: vi.fn().mockImplementation(() => ({
    log: {
      extend: extend,
    },
  })),
  useMemo: vi.fn().mockImplementation((f: any) => {
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
