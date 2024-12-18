import { fireEvent, render } from '@testing-library/react';

import SceneRuleTargetOpacityEditor from '../SceneRuleTargetOpacityEditor';

vi.mock('@cloudscape-design/components', () => ({
  Grid: 'Grid',
  Input: 'input',
}));

describe('<SceneRuleTargetOpacityEditor>', () => {
  it('render expected field', () => {
    const onChange = vi.fn();
    const value = '1';

    const { container } = render(<SceneRuleTargetOpacityEditor targetValue={value} onChange={onChange} />);
    expect(container).toMatchSnapshot();
  });

  it('update value on change', async () => {
    const onChange = vi.fn();
    const value = '1';

    const { findByTestId } = render(<SceneRuleTargetOpacityEditor targetValue={value} onChange={onChange} />);

    const input = await findByTestId('tm-opacity-field');

    fireEvent.focusIn(input);
    fireEvent.change(input, { target: { value: '0.5' } });
    fireEvent.focusOut(input);

    expect(onChange).toBeCalledWith('0.5');
  });
});
