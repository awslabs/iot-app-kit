import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render } from '@/tests/testing-library';

import { mockProvider } from '../../../../../tests/components/panels/scene-components/MockComponents';
import { Component } from '../../../../models/SceneModels';
import { type IDataOverlayComponentInternal } from '../../../../store';

import { DataBindingMapEditor } from './DataBindingMapEditor';
import { type IValueDataBindingBuilderProps } from './ValueDataBindingBuilder';

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

vi.mock('../../../../utils/mathUtils', () => ({
  generateUUID: vi.fn(() => 'random-uuid'),
}));

let builderOnChangeCb;
vi.mock('./ValueDataBindingBuilder', async () => {
  const originalModule = await vi.importActual('./ValueDataBindingBuilder');
  return {
    ...originalModule,
    ValueDataBindingBuilder: (props: IValueDataBindingBuilderProps) => {
      builderOnChangeCb = props.onChange;
      return <div data-testid='ValueDataBindingBuilder'>{JSON.stringify(props)}</div>;
    },
  };
});

describe('DataBindingMapEditor', () => {
  const component = {
    subType: Component.DataOverlaySubType.OverlayPanel,
    valueDataBindings: [
      {
        bindingName: 'binding-1',
        valueDataBinding: {
          dataBindingContext: 'random-1',
        },
      },
    ],
  } as unknown as IDataOverlayComponentInternal;
  const onUpdateCallbackMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should remove binding by clicking remove button', async () => {
    const { container } = render(
      <DataBindingMapEditor
        hasRemoveButton={true}
        hasBindingName
        valueDataBindingProvider={mockProvider}
        component={component}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );
    const polarisWrapper = wrapper(container);

    const removeButton = polarisWrapper.findButton('[data-testid="remove-binding-button"]');
    expect(removeButton).not.toBeNull();

    act(() => {
      removeButton!.click();
    });

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith({ ...component, valueDataBindings: [] }, true);
  });

  it('should call update when data binding changed', async () => {
    render(
      <DataBindingMapEditor
        hasBindingName
        valueDataBindingProvider={mockProvider}
        component={{ ...component, valueDataBindings: [...component.valueDataBindings, { bindingName: 'binding-2' }] }}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    builderOnChangeCb({ key: 'value' }, 1);

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith(
      {
        ...component,
        valueDataBindings: [
          ...component.valueDataBindings,
          { bindingName: 'binding-2', valueDataBinding: { key: 'value' } },
        ],
      },
      true,
    );
  });
});
