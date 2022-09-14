import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import SceneRuleTargetOpacityEditor from '../SceneRuleTargetOpacityEditor';

jest.mock('@awsui/components-react', () => ({
  Grid: 'Grid',
  Input: 'input',
}));

describe('<SceneRuleTargetOpacityEditor>', () => {
  it('render expected field', () => {
    const onChange = jest.fn();
    const value = '1';

    const { container } = render(<SceneRuleTargetOpacityEditor targetValue={value} onChange={onChange} />);
    expect(container).toMatchSnapshot();
  });

  it('update value on change', async () => {
    const onChange = jest.fn();
    const value = '1';

    const { findByTestId, container } = render(
      <SceneRuleTargetOpacityEditor targetValue={value} onChange={onChange} />,
    );

    const input = await findByTestId('tm-opacity-field');

    fireEvent.focusIn(input);
    fireEvent.change(input, { target: { value: '0.5' } });
    fireEvent.focusOut(input);

    expect(onChange).toBeCalledWith('0.5');
  });
});
