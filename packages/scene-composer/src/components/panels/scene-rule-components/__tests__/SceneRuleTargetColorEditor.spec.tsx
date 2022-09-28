import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { SceneRuleTargetColorEditor } from '../SceneRuleTargetColorEditor';
import { colors } from '../../../../utils/styleUtils';

describe('SceneRuleTargetColorEditor', () => {
  it('should open the chrome-picker on click', () => {
    const { container } = render(<SceneRuleTargetColorEditor targetValue={colors.infoBlue} onChange={jest.fn()} />);
    const polarisWrapper = wrapper(container);
    const colorSwatch = polarisWrapper.find('[data-testid="color-swatch"]');
    colorSwatch!.click();

    const colorPicker = polarisWrapper.findByClassName('chrome-picker');
    expect(colorPicker).not.toBeNull();
  });
});
