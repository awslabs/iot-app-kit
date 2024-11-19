import { render, screen } from '@/tests/testing-library';

import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { KnownComponentType } from '../../../interfaces';
import { type IEntityBindingComponentInternal, type ISceneNodeInternal, accessStore } from '../../../store';

import { EntityBindingComponentEditor } from './EntityBindingComponentEditor';

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

describe('EntityindingComponentEditor', () => {
  const component: IEntityBindingComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.EntityBinding,
    valueDataBinding: {
      dataBindingContext: { entityId: 'abcd' },
    },
  };

  const node = {
    ref: 'node-ref',
  } as ISceneNodeInternal;
  const updateComponentInternalMock = vi.fn();
  const removeComponentMock = vi.fn();

  const baseState = {
    updateComponentInternal: updateComponentInternalMock,
    removeComponent: removeComponentMock,
    getEditorConfig: vi.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not have remove button', async () => {
    accessStore('default').setState(baseState);
    render(<EntityBindingComponentEditor node={node} component={component} />);
    expect(screen.queryByText('remove-binding-button')).toBeNull();
    expect(updateComponentInternalMock).toBeCalledTimes(0);
  });

  it('should have entity search field', async () => {
    accessStore('default').setState(baseState);
    render(<EntityBindingComponentEditor node={node} component={component} />);
    expect(screen.getByTestId('select-entityId')).toBeTruthy();
    expect(updateComponentInternalMock).toBeCalledTimes(0);
  });
});
