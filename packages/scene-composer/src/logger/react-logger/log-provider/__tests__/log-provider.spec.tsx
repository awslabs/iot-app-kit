import { render } from '@testing-library/react';
import { useContext } from 'react';

import LogProvider from '..';
import DebugLogger from '../../../DebugLogger';
import type ILogger from '../../../ILogger';
import LoggingContext from '../../contexts/logging';

vi.mock('../../../DebugLogger');

const MockLogger = {
  extend() {
    return MockLogger;
  },
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  verbose: vi.fn(),
};

describe('<LogProvider />', () => {
  it('Log unhandled errors in child components', () => {
    const Child = () => {
      throw new Error('expected error');
    };

    const { container } = render(
      <LogProvider namespace='test-test' ErrorView={() => <div>Something went wrong</div>}>
        <Child />
      </LogProvider>,
    );

    expect(container.outerHTML).toMatchSnapshot();
  });

  it('should allow overriding the default logger', () => {
    const Child = () => {
      throw new Error('expected error');
    };

    const logger = MockLogger as ILogger;

    const { container } = render(
      <LogProvider namespace='test-test' logger={logger} ErrorView={() => <div>Something went wrong</div>}>
        <Child />
      </LogProvider>,
    );

    expect(container.outerHTML).toMatchSnapshot();
  });

  it('should support nesting loggers', () => {
    const log = vi.fn();
    const top = 'This is a log';
    const inner = 'this is another log';

    (DebugLogger as any).mockImplementation(() => ({
      info: log,
      verbose: vi.fn(),
      extend: (namespace: string) => new DebugLogger(namespace),
    }));

    const LoggingComponent = ({ message }: { message: string }) => {
      const { log } = useContext(LoggingContext);

      log?.info(message);

      return <div>Logged</div>;
    };

    render(
      <LogProvider namespace='Foo'>
        <LoggingComponent message={top} />
        <LogProvider namespace='Bar'>
          <LoggingComponent message={inner} />
        </LogProvider>
      </LogProvider>,
    );

    expect(log).toBeCalledWith(top);
    expect(log).toBeCalledWith(inner);
  });
});
