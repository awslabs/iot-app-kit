import { render } from '@/tests/testing-library';
import { BoxGeometry, Group, Mesh } from 'three';
import { KnownComponentType } from '../../../../interfaces';
import { Component } from '../../../../models/SceneModels';
import { type IDataOverlayComponentInternal, type ISceneNodeInternal, accessStore } from '../../../../store';
import { DataOverlayComponent } from '../DataOverlayComponent';

vi.mock('@react-three/fiber', async () => {
  const originalModule = await vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useLoader: vi.fn(),
    useFrame: vi.fn().mockImplementation((func) => {
      func();
    }),
  };
});

vi.mock('../DataOverlayContainer', () => ({
  DataOverlayContainer: (...props: unknown[]) => <div data-testid='container'>{JSON.stringify(props, null, '\t')}</div>,
}));

describe.skip('DataOverlayComponent', () => {
  const mockComponent: IDataOverlayComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.DataOverlay,
    subType: Component.DataOverlaySubType.OverlayPanel,
    dataRows: [
      {
        rowType: Component.DataOverlayRowType.Markdown,
        content: 'content',
      },
    ],
    valueDataBindings: [
      {
        bindingName: 'bindingA',
        valueDataBinding: { dataBindingContext: 'dataBindingContext' },
      },
    ],
  };
  const mockNode: Partial<ISceneNodeInternal> = {
    ref: 'node-ref',
    transform: { position: [1, 2, 3], rotation: [0, 0, 0], scale: [0, 0, 0] },
    components: [mockComponent],
  };

  const group = new Group();
  const geometry = new BoxGeometry(2, 4, 6);
  const mesh = new Mesh(geometry);
  group.add(mesh);

  const getObject3DBySceneNodeRef = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    accessStore('default').setState({ getObject3DBySceneNodeRef });
  });

  it('should render the component correctly', () => {
    const { container } = render(
      <DataOverlayComponent node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    expect(container.getElementsByClassName('tm-html-wrapper').length).toBe(1);
    expect(container).toMatchSnapshot();
  });
});
