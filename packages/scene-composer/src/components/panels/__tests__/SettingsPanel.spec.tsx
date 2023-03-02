import React from 'react';
import { render } from '@testing-library/react';

import { SettingsPanel } from '..';
import { useStore } from '../../../store';
import { setFeatureConfig } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../../interfaces';

jest.spyOn(React, 'useContext').mockReturnValue('sceneComponserId' as any);

jest.mock('../CommonPanelComponents', () => ({
  ...jest.requireActual('../CommonPanelComponents'),
  ExpandableInfoSection: (props) => <div data-mocked='ExpandableInfoSection' {...props} />,
}));

describe('SettingsPanel contains expected elements.', () => {
  [{ [COMPOSER_FEATURES.TagResize]: true }, { [COMPOSER_FEATURES.TagResize]: false }].forEach((featureConfig) => {
    it(`SettingsPanel contains expected elements for features ${featureConfig} `, async () => {
      setFeatureConfig(featureConfig);

      const setSceneProperty = jest.fn();
      useStore('sceneComponserId').setState({
        setSceneProperty: setSceneProperty,
        getSceneProperty: jest.fn().mockReturnValue('neutral'),
      });

      const { container } = render(<SettingsPanel />);

      expect(container).toMatchSnapshot();
    });
  });
});
