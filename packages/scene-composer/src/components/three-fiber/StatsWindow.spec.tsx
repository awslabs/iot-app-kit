import { render } from '@testing-library/react';
import StatsImpl from 'stats.js';

import { StatsWindow } from './StatsWindow';

vi.mock('stats.js');

describe('StatsWindow', () => {
  it('should call StatsImpl Dependencies', () => {
    const showPanel = vi.fn();

    (StatsImpl as vi.Mock).mockReturnValue(() => ({
      showPanel,
      dom: document.createElement('div'),
      begin: vi.fn(),
      end: vi.fn(),
    }));

    render(<StatsWindow />);

    expect(StatsImpl).toBeCalled();
    expect(showPanel).toBeCalledWith(0);
  });
});
