import React from 'react';
import { render } from '@testing-library/react';

import useFeature from '../../../hooks/useFeature';

import SceneHierarchyPanel from './SceneHierarchyPanel';

jest.mock('../../../hooks/useFeature');

describe('SceneHierarchyPanel', () => {
  ['T1', 'C'].forEach((treatment) => {
    it(`should render search hierarchy correctly when enabled is "${treatment}"`, () => {
      (useFeature as unknown as jest.Mock).mockImplementation(() => [{ variation: treatment }]);

      const { container } = render(<SceneHierarchyPanel />);
      expect(container).toMatchSnapshot();
    });
  });
});
