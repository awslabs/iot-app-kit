import React from 'react';
import { act, render } from '@testing-library/react';

import useLogger from '../useLogger';
import useLifecycleLogging from '../useLifecycleLogging';

jest.mock('../useLogger');

describe('useLifecycleLogging', () => {
  it('should log rendering, mounted, and unmounted lifecycle events', () => {
    const mockLogger = {
      verbose: jest.fn(),
    };

    (useLogger as any).mockImplementation(() => mockLogger);

    const DummyComponent = () => {
      useLifecycleLogging('DummyComponent');
      return <div>I'm a dummy</div>;
    };

    const { unmount } = render(<DummyComponent />);

    expect(mockLogger.verbose).toBeCalledWith('rendering');
    expect(mockLogger.verbose).toBeCalledWith('mounted');

    act(() => {
      unmount();
    });

    expect(mockLogger.verbose).toBeCalledWith('unmounted');
  });

  it('should do nothing if log is not initialized', (done) => {
    (useLogger as any).mockImplementation(() => undefined);

    const DummyComponent = () => {
      useLifecycleLogging('DummyComponent');
      return <div>I'm a dummy</div>;
    };

    try {
      render(<DummyComponent />);
      done();
    } catch (ex) {
      done.fail('Should not fail to render');
    }
  });
});
