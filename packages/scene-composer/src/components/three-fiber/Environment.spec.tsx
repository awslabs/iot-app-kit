import React from 'react';
import { render } from '@testing-library/react';

import Environment, { presets } from './Environment';

describe('<Environment />', () => {
  Object.keys(presets).forEach((preset) => {
    it(`should render ${preset} preset correctly with DREI Environment`, () => {
      const { container } = render(<Environment preset={preset} />);

      expect(container).toMatchSnapshot();
    });
  });
});
