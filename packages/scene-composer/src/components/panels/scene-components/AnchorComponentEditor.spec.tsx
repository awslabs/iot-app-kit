import { render, waitFor } from '@/tests/testing-library';
import { useCallback } from 'react';

import {
  mockBinding,
  mockComponent,
  mockNode,
  mockProvider,
} from '../../../../tests/components/panels/scene-components/MockComponents';
import { type IAnchorComponentInternal, accessStore } from '../../../store';

import { AnchorComponentEditor, convertParamsToKeyValuePairs } from './AnchorComponentEditor';

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useCallback: vi.fn().mockImplementation((cb) => cb),
}));

vi.mock('../../../common/GlobalSettings');

const updateComponentInternalFn = vi.fn();

const mockEditorConfig = {
  valueDataBindingProvider: mockProvider,
};

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getEditorConfig: vi.fn(() => {
    return mockEditorConfig;
  }),
};

vi.mock('../../../../src/store/Store', async () => {
  const originalModule = await vi.importActual('../../../../src/store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useSceneDocument: vi.fn(() => ({
      document: {},
      getSceneProperty: vi.fn(),
      getSceneRuleMapById: vi.fn(),
      listSceneRuleMapIds: vi.fn(() => {
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
    vi.clearAllMocks();
  });

  it('should render with tag style', () => {
    accessStore('default').setState(baseState);
    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);
    expect(container).toMatchSnapshot();
  });

  describe('onUpdateCallback', () => {
    it('should update the component internally', () => {
      accessStore('default').setState(baseState);

      render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);
      const callbackFn = (useCallback as vi.Mock).mock.calls[1][0];

      callbackFn({ ref: 'ref', prop: 'value' });

      waitFor(() => expect(updateComponentInternalFn).toBeCalled());
    });
  });
});

describe('convertParamsToKeyValuePairs', () => {
  it('should convert map to pairs', () => {
    const result = convertParamsToKeyValuePairs({ 'item 1': 'value', 'item 2': 'value' });

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "key": "item 1",
          "value": "value",
        },
        {
          "key": "item 2",
          "value": "value",
        },
      ]
    `);
  });
});
