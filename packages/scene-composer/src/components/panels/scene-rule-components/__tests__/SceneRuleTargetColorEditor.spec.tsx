import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { SceneRuleTargetColorEditor } from '../SceneRuleTargetColorEditor';
import { colors } from '../../../../utils/styleUtils';

jest.mock('react-color', () => ({
  ...jest.requireActual('react-color'),
  ChromePicker: (props) => <div data-mocked='ChromePicker' {...props} />,
}));

describe('SceneRuleTargetColorEditor', () => {
  it('should render as expected', () => {
    const { container } = render(<SceneRuleTargetColorEditor targetValue={colors.infoBlue} onChange={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should toggle color picker on click', () => {
    const { container, getByTestId } = render(
      <SceneRuleTargetColorEditor targetValue={colors.infoBlue} onChange={jest.fn()} />,
    );

    const colorSwatch = getByTestId('color-swatch');

    fireEvent.click(colorSwatch);

    expect(container).toMatchSnapshot();
  });
});
