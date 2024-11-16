import { render } from '@testing-library/react';
import StatsImpl from 'stats.js';

import { StatsWindow } from './StatsWindow';

jest.mock('stats.js');

describe('StatsWindow', () => {
  it('should call StatsImpl Dependencies', () => {
    const showPanel = jest.fn();

    (StatsImpl as jest.Mock).mockReturnValue(() => ({
      showPanel,
      dom: document.createElement('div'),
      begin: jest.fn(),
      end: jest.fn(),
    }));

    render(<StatsWindow />);

    expect(StatsImpl).toBeCalled();
    expect(showPanel).toBeCalledWith(0);
  });
});
