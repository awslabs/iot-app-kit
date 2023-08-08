import React from 'react';
import { render } from '@testing-library/react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SceneRuleTargetEditor } from '../SceneRuleTargetEditor';
import { DefaultAnchorStatus, SceneResourceType } from '../../../../';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import useFeature from '../../../../hooks/useFeature';

jest.mock('../SceneRuleTargetColorEditor', () => ({
  SceneRuleTargetColorEditor: () => 'SceneRuleTargetColorEditor',
}));
jest.mock('../SceneRuleTargetIconEditor', () => ({
  SceneRuleTargetIconEditor: () => 'SceneRuleTargetIconEditor',
}));
jest.mock('../SceneRuleTargetOpacityEditor', () => () => 'SceneRuleTargetOpacityEditor');

jest.mock('../../../../utils/sceneResourceUtils', () => ({
  ...jest.requireActual('../../../../utils/sceneResourceUtils'),
  getSceneResourceInfo: jest.fn(),
}));

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: jest.fn(),
}));

jest.mock('../../../../hooks/useFeature', () => jest.fn());

describe('SceneRuleTargetEditor', () => {
  [
    { opacityRuleFeature: 'T1', type: SceneResourceType.Icon },
    { opacityRuleFeature: 'C', type: SceneResourceType.Icon },
    { opacityRuleFeature: 'T1', type: SceneResourceType.Color },
    { opacityRuleFeature: 'C', type: SceneResourceType.Color },
    { opacityRuleFeature: 'T1', type: SceneResourceType.Opacity },
    { opacityRuleFeature: 'C', type: SceneResourceType.Opacity },
  ].forEach(({ opacityRuleFeature, type }) => {
    it(`should render a drop down with appropriate options: { opacityRuleFeature: ${opacityRuleFeature}, type: ${type} }`, () => {
      (useIntl as jest.Mock).mockReturnValue({
        formatMessage: jest.fn(() => 'test message'),
      });
      (useFeature as jest.Mock).mockReturnValue([{ variation: opacityRuleFeature }]);
      (getSceneResourceInfo as jest.Mock).mockReturnValue({
        type,
      });

      const { container } = render(<SceneRuleTargetEditor target={DefaultAnchorStatus.Info} onChange={jest.fn()} />);

      expect(container).toMatchSnapshot();
    });
  });
});
