import SubModelTreeItemLabel from '../SubModelTreeItemLabel';

import { render } from '@/tests/testing-library';

describe('SubModelTreeItemLabel', () => {
  it('should render as appropriate', () => {
    const onAdd = vi.fn();

    const { container } = render(
      <SubModelTreeItemLabel visible onAdd={onAdd}>
        Label
      </SubModelTreeItemLabel>,
    );

    expect(container).toMatchSnapshot();
  });
});
