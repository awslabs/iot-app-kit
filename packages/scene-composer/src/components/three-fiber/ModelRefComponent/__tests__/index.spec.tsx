import { render } from '@/tests/testing-library';
import { KnownComponentType } from '../../../../interfaces';
import { ModelType } from '../../../../models/SceneModels';
import { type IModelRefComponentInternal, type ISceneNodeInternal } from '../../../../store';
import ModelRefComponent from '../index';

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

vi.mock('../GLTFModelComponent', () => ({
  GLTFModelComponent: (props) => <div id='GLTFModelComponent' {...props} />,
  ErrorModelComponent: (props) => <div id='ErrorModelComponent' {...props} />,
}));

vi.mock('../TilesModelComponent', () => ({
  TilesModelComponent: (props) => <div id='TilesModelComponent' {...props} />,
}));

describe('ModelRefComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const component: IModelRefComponentInternal = {
      uri: 'uri',
      modelType: ModelType.GLB,
      ref: 'test-ref',
      type: KnownComponentType.ModelRef,
    };

    const node: ISceneNodeInternal = {
      ref: 'test-ref',
      name: 'test-name',
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
      transformConstraint: {},
      components: [component],
      childRefs: [],
      properties: {},
    };

    const { container } = render(<ModelRefComponent node={node} component={component} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with Tiles Model Type', () => {
    const component: IModelRefComponentInternal = {
      uri: 'uri',
      modelType: ModelType.Tiles3D,
      ref: 'test-ref',
      type: 'ModelRef',
    };

    const node: ISceneNodeInternal = {
      ref: 'test-ref',
      name: 'test-name',
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
      transformConstraint: {},
      components: [component],
      childRefs: [],
      properties: {},
    };

    const { container } = render(<ModelRefComponent node={node} component={component} />);

    expect(container).toMatchSnapshot();
  });
});
