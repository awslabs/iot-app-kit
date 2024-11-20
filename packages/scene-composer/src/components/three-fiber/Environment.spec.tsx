import Environment, { presets } from './Environment';

import { render } from '@/tests/testing-library';

describe('<Environment />', () => {
  Object.keys(presets).forEach((preset) => {
    it(`should render ${preset} preset correctly with DREI Environment`, () => {
      const { container } = render(<Environment preset={preset} />);

      expect(container).toMatchSnapshot();
    });
  });
});
