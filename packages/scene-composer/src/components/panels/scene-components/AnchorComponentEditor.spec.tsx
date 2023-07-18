import React, { useCallback } from 'react';
import { render } from '@testing-library/react';

import { IAnchorComponentInternal, useStore } from '../../../store';
import {
  mockBinding,
  mockNode,
  mockComponent,
  mockProvider,
} from '../../../../tests/components/panels/scene-components/MockComponents';

import { AnchorComponentEditor, convertParamsToKeyValuePairs } from './AnchorComponentEditor';
import { COMPOSER_FEATURES } from '../../../interfaces';
import { getGlobalSettings } from '../../../common/GlobalSettings';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn(),
}));

jest.mock('../../../common/GlobalSettings')


const updateComponentInternalFn = jest.fn();

const mockEditorConfig = {
  valueDataBindingProvider: mockProvider,
};

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getEditorConfig: jest.fn(() => {
    return mockEditorConfig;
  }),
};

jest.mock('../../../../src/store/Store', () => {
  const originalModule = jest.requireActual('../../../../src/store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useSceneDocument: jest.fn(() => ({
      listSceneRuleMapIds: jest.fn(() => {
        return ['rule1'];
      }),
    })),
  };
});


describe('AnchorComponentEditor', () => {
  // has rule already selected
  const anchorComponent: IAnchorComponentInternal = {
    ...mockComponent,
    valueDataBinding: mockBinding,
    ruleBasedMapId: 'rule1',
    icon: 'icon1',
    navLink: {
      destination: 'dest1',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no tag style', () => {
    useStore('default').setState(baseState);
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    const mockFeatureConfig = { [COMPOSER_FEATURES.TagStyle]: false }
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig })
    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with tag style', () => {
    useStore('default').setState(baseState);
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    const mockFeatureConfig = { [COMPOSER_FEATURES.TagStyle]: true }
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfig })
    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);
    expect(container).toMatchSnapshot();
  });

  describe('onUpdateCallback', () => {
    it('should update the component internally', () => {
      useStore('default').setState(baseState);

      render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);
      const callbackFn = (useCallback as jest.Mock).mock.calls[1][0];

      callbackFn({ ref: 'ref', prop: 'value' });

      expect(updateComponentInternalFn).toBeCalled();
    });
  });
});

describe('convertParamsToKeyValuePairs', () => {
  it('should convert map to pairs', () => {
    const result = convertParamsToKeyValuePairs({ 'item 1': 'value', 'item 2': 'value' });

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "key": "item 1",
          "value": "value",
        },
        Object {
          "key": "item 2",
          "value": "value",
        },
      ]
    `);
  });
});
