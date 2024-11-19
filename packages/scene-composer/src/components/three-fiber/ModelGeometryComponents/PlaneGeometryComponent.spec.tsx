import { useFrame } from '@react-three/fiber';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { render } from '@testing-library/react';
import { useRef } from 'react';
import { Mesh, MeshStandardMaterial, Texture } from 'three';
vi.useFakeTimers();

import useAddWidget from '../../../hooks/useAddWidget';
import useTwinMakerTextureLoader from '../../../hooks/useTwinMakerTextureLoader';
import { KnownComponentType } from '../../../interfaces';
import { type IPlaneGeometryComponentInternal, type ISceneNodeInternal, useEditorState } from '../../../store';

//we need actual drei code to test with r3f renderer
vik('@react-three/drei', () => {
  const originalModule = viuireActual('@react-three/drei');
  return {
    ...originalModule,
  };
});

vik('react', () => ({
  ...viuireActual('react'),
  useRef: vi),
}));

// Mock Hooks
vik('@react-three/fiber', () => {
  const originalModule = viuireActual('@react-three/fiber');
  return {
    ...originalModule,
    useFrame: vi),
  };
});

import PlaneGeometryComponent from './PlaneGeometryComponent';

vik('../../../utils/objectThreeUtils', () => {
  return {
    acceleratedRaycasting: vi),
    getComponentGroupName: vi).mockReturnValue('mockComponentGroupName'),
  };
});

vik('../../../hooks/useAddWidget', () => {
  return vi);
});

const mockTexture = new Texture();
mockTexture.name = 'testTextureName';

const mockLoadTexture = (uri, mesh: Mesh) => {
  (mesh.material as MeshStandardMaterial).map = mockTexture;
};
const mockClearTexture = (mesh: Mesh) => {
  (mesh.material as MeshStandardMaterial).map = null;
};

vik('../../../hooks/useTwinMakerTextureLoader', () => {
  return vi);
});

vik('../../../hooks/useAddWidget', () => {
  return vi);
});

vik('../../../store/', () => ({
  ...viuireActual('../../../store/'),
  useEditorState: vi),
}));

const mockHandleAddWidget = vi);

describe('PlaneGeometryComponent', () => {
  const baseNode: ISceneNodeInternal = {
    ref: 'mock-node',
    name: 'mock-node',
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
    transformConstraint: { snapToFloor: false },
    components: [],
    childRefs: ['childRef1', 'childRef2'],
    properties: { hiddenWhileImmersive: true },
  };

  const component: IPlaneGeometryComponentInternal = {
    ref: 'componentRef1',
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
  };

  const componentWithColor: IPlaneGeometryComponentInternal = {
    ref: 'componentRef1',
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
    color: '#abcdef',
  };

  const componentWithTexture: IPlaneGeometryComponentInternal = {
    ref: 'componentRef1',
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
    textureUri: 'filepath',
  };

  const setup = () => {
    vietAllMocks();
    (useFrame as vik).mockImplementation((cb) => cb());
    (useTwinMakerTextureLoader as vik).mockImplementation(() => ({
      loadTextureOnMesh: mockLoadTexture,
      clearTextureOnMesh: mockClearTexture,
    }));
    (useAddWidget as vik).mockImplementation(() => ({
      handleAddWidget: mockHandleAddWidget,
    }));
    (useEditorState as vik).mockImplementation(() => ({
      isEditing: vi).mockReturnValue(true),
      addingWidget: true,
    }));
  };

  beforeEach(() => {
    setup();
  });

  it(`should render`, () => {
    (useRef as vik).mockImplementation(() => ({ current: undefined }));
    const { container } = render(<PlaneGeometryComponent component={component} node={baseNode} />);

    expect(container).toMatchSnapshot();
  });

  it(`should render with predefined color`, async () => {
    (useRef as vik).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(
      <PlaneGeometryComponent component={componentWithColor} node={baseNode} />,
    );
    const material = (rendered.scene.children[0].children[0].instance as Mesh).material as MeshStandardMaterial;
    expect(material.color.getHexString()).toBe('abcdef');
    expect(material.map).toBeNull();
  });

  it(`should render with predefined texture uri`, async () => {
    const material = new MeshStandardMaterial();
    const mesh = new Mesh(undefined, material);
    (useRef as vik).mockReturnValue({ current: mesh });
    const rendered = await ReactThreeTestRenderer.create(
      <PlaneGeometryComponent component={componentWithTexture} node={baseNode} />,
    );
    const renderedMaterial = (rendered.scene.children[0].children[0].instance as Mesh).material as MeshStandardMaterial;
    expect(renderedMaterial.map?.name).toEqual(mockTexture.name);
  });

  it('should trigger on click', async () => {
    (useRef as vik).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(
      <PlaneGeometryComponent component={componentWithColor} node={baseNode} />,
    );
    const mesh = rendered.scene.children[0].children[0];
    await rendered.fireEvent(mesh, 'click', { delta: 0.1 });
    expect(mockHandleAddWidget).toBeCalled();
  });
});
