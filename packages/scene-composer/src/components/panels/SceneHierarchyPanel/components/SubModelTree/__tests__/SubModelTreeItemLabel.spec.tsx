import React from 'react';
import { render } from '@testing-library/react';

import SubModelTreeItemLabel from '../SubModelTreeItemLabel';

describe('SubModelTreeItemLabel', () => {
  it('should render as appropriate', () => {
    const onAdd = jest.fn();

    const { container } = render(
      <SubModelTreeItemLabel visible onAdd={onAdd}>
        Label
      </SubModelTreeItemLabel>,
    );

    expect(container).toMatchSnapshot();
  });
});
