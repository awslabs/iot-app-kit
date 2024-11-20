import { render } from '@/tests/testing-library';
import { setFeatureConfig } from '../../../common/GlobalSettings';
import { KnownComponentType } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';
import { type ISceneNodeInternal, accessStore } from '../../../store';
import { SceneNodeInspectorPanel } from '../SceneNodeInspectorPanel';

const getSceneNodeByRef = vi.fn();
const updateSceneNodeInternal = vi.fn();

vi.mock('../ComponentEditor', () => ({
  ComponentEditor: (...props: unknown[]) => <div data-testid='ComponentEditor'>{JSON.stringify(props)}</div>,
}));

vi.mock('../AddComponentMenu', () => ({
  AddComponentMenu: (...props: unknown[]) => <div data-testid='AddComponentMenu'>{JSON.stringify(props)}</div>,
}));

vi.mock('../ComponentEditMenu', () => ({
  ComponentEditMenu: (...props: unknown[]) => <div data-testid='ComponentEditMenu'>{JSON.stringify(props)}</div>,
}));

vi.mock('../../../three/transformUtils', async () => {
  const originalModule = await vi.importActual('../../../three/transformUtils');
  return {
    __esModule: true,
    ...originalModule,
    useSnapObjectToFloor: vi.fn(),
  };
});

describe('SceneNodeInspectorPanel returns expected elements.', () => {
  const baseNode: ISceneNodeInternal = {
    ref: 'node-ref',
    properties: {},
    childRefs: [],
    name: 'node-name',
    transform: {
      position: [1, 1, 1],
      rotation: [0, 0, 0],
      scale: [2, 2, 2],
    },
    transformConstraint: {
      snapToFloor: false,
    },
    components: [],
  };

  beforeEach(() => {
    accessStore('default').setState({
      document: {},
      selectedSceneNodeRef: 'testNodeRef',
      getSceneNodeByRef: getSceneNodeByRef,
      updateSceneNodeInternal: updateSceneNodeInternal,
    } as any);
    vi.clearAllMocks();
    setFeatureConfig({});
  });

  it('SceneNode panel contains expected elements when none selected scene node.', async () => {
    getSceneNodeByRef.mockReturnValue(null);
    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('SceneNode panel contains expected elements when selected scene node.', async () => {
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          ref: '3D-obj-ref-1',
          type: KnownComponentType.ModelRef,
        },
      ],
      transformConstraint: {
        snapToFloor: true,
      },
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('disable y scale when selected scene node is LinearPlane motion indicator.', async () => {
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          ref: '3D-obj-ref-1',
          type: KnownComponentType.MotionIndicator,
          shape: Component.MotionIndicatorShape.LinearPlane,
        },
      ],
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it.skip('disable rotation, hide scale and render correct overlay section when selected scene node is Tag.', async () => {
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          ref: '3D-obj-ref-1',
          type: KnownComponentType.Tag,
        },
      ],
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container.querySelector('[controlid="Rotation_input_X"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_X"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_X"')).toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Y"')).toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Z"')).toBeNull();
    expect(container).toMatchSnapshot();
  });

  it.skip('disable scale and rotation when selected scene node is Annotation.', async () => {
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          ref: '3D-obj-ref-1',
          type: KnownComponentType.DataOverlay,
          subType: Component.DataOverlaySubType.TextAnnotation,
        },
      ],
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container.querySelector('[controlid="Rotation_input_X"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_X"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_X"')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_X"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Y"')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Y"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Z"')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Z"')?.getAttribute('disabled')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it.skip('disable rotation, hide scale and render correct overlay section when selected scene node is Tag with Overlay panel.', async () => {
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          ref: '3D-obj-ref-1',
          type: KnownComponentType.Tag,
        },
        {
          ref: '3D-obj-ref-2',
          type: KnownComponentType.DataOverlay,
          subType: Component.DataOverlaySubType.OverlayPanel,
        },
      ],
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container.querySelector('[controlid="Rotation_input_X"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_X"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_X"')).toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Y"')).toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Z"')).toBeNull();
    expect(container).toMatchSnapshot();
  });
});
