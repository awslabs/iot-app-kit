import React, { useCallback } from 'react';
import { render, waitFor } from '@testing-library/react';

import { IAnchorComponentInternal, useStore } from '../../../store';
import {
  mockBinding,
  mockNode,
  mockComponent,
  mockProvider,
} from '../../../../tests/components/panels/scene-components/MockComponents';

import { AnchorComponentEditor, convertParamsToKeyValuePairs } from './AnchorComponentEditor';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn().mockImplementation((cb) => cb),
}));

jest.mock('../../../common/GlobalSettings');

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
      getSceneProperty: jest.fn(),
      getSceneRuleMapById: jest.fn(),
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

  it('should render with tag style', () => {
    useStore('default').setState(baseState);
    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);
    expect(container).toMatchSnapshot();
  });

  describe('onUpdateCallback', () => {
    it('should update the component internally', () => {
      useStore('default').setState(baseState);

      render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);
      const callbackFn = (useCallback as jest.Mock).mock.calls[1][0];

      callbackFn({ ref: 'ref', prop: 'value' });

      waitFor(() => expect(updateComponentInternalFn).toBeCalled());
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
