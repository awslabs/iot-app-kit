import React from 'react';
import { render } from '@testing-library/react';

import PreviewArrow from './PreviewArrow';

describe('<PreviewArrow />', () => {
  [
    { color: 'blue', background: 'red', opacity: 1 },
    { color: 'green', background: 'purple', opacity: 0.7 },
    { color: 'black', background: 'gray', opacity: 0.5 },
  ].forEach(({ color, background, opacity }) => {
    it(`should render arrow with color: "${color}", background: "${background}" and opacity "${opacity}"`, () => {
      const { container } = render(<PreviewArrow color={color} background={background} opacity={opacity} />);
      expect(container).toMatchSnapshot();
    });
  });
});
