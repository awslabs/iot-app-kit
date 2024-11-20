import { act, render } from '@testing-library/react';

import useLifecycleLogging from '../useLifecycleLogging';
import useLogger from '../useLogger';

vi.mock('../useLogger');

describe('useLifecycleLogging', () => {
  it('should log rendering, mounted, and unmounted lifecycle events', () => {
    const mockLogger = {
      verbose: vi.fn(),
    };

    (useLogger as any).mockImplementation(() => mockLogger);

    const DummyComponent = () => {
      useLifecycleLogging('DummyComponent');
      return <div>I am a dummy</div>;
    };

    const { unmount } = render(<DummyComponent />);

    expect(mockLogger.verbose).toBeCalledWith('rendering');
    expect(mockLogger.verbose).toBeCalledWith('mounted');

    act(() => {
      unmount();
    });

    expect(mockLogger.verbose).toBeCalledWith('unmounted');
  });
});
