import React from 'react';
import { render } from '@testing-library/react';
import { useIntl } from 'react-intl';

import { SceneRuleTargetEditor } from '../SceneRuleTargetEditor';
import { DefaultAnchorStatus, SceneResourceType } from '../../../../';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';

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
  [{ type: SceneResourceType.Icon }, { type: SceneResourceType.Color }, { type: SceneResourceType.Opacity }].forEach(
    ({ type }) => {
      it(`should render a drop down with appropriate resource type: ${type}`, () => {
        (useIntl as jest.Mock).mockReturnValue({
          formatMessage: jest.fn(() => 'test message'),
        });
        (getSceneResourceInfo as jest.Mock).mockReturnValue({
          type,
        });

        const { container } = render(<SceneRuleTargetEditor target={DefaultAnchorStatus.Info} onChange={jest.fn()} />);

        expect(container).toMatchSnapshot();
      });
    },
  );
});
