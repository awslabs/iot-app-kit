import React from 'react';
import renderer from 'react-test-renderer';

import { Divider } from '../../src/components/Divider';

describe('Divider', () => {
  it('should render correctly', () => {
    const container = renderer.create(<Divider />);
    expect(container).toMatchSnapshot();
  });
});
