import { useFrame } from '@react-three/fiber';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { render } from '@testing-library/react';
import { useRef } from 'react';
import { Mesh, MeshStandardMaterial, Texture } from 'three';
import type { Mock } from 'vitest';

vi.useFakeTimers();

import useAddWidget from '../../../hooks/useAddWidget';
import useTwinMakerTextureLoader from '../../../hooks/useTwinMakerTextureLoader';
import { KnownComponentType } from '../../../interfaces';
import { type IPlaneGeometryComponentInternal, type ISceneNodeInternal, useEditorState } from '../../../store';

//we need actual drei code to test with r3f renderer
vi.mock('@react-three/drei', async () => {
  const originalModule = await vi.importActual('@react-three/drei');
  return {
    ...originalModule,
  };
});

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useRef: vi.fn(),
}));

// Mock Hooks
vi.mock('@react-three/fiber', async () => {
  const originalModule = vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useFrame: vi.fn(),
  };
});

import PlaneGeometryComponent from './PlaneGeometryComponent';

vi.mock('../../../utils/objectThreeUtils', () => {
  return {
    acceleratedRaycasting: vi.fn(),
    getComponentGroupName: vi.fn().mockReturnValue('mockComponentGroupName'),
  };
});

vi.mock('../../../hooks/useAddWidget', () => ({ default: vi.fn() }));

const mockTexture = new Texture();
mockTexture.name = 'testTextureName';

const mockLoadTexture = (uri, mesh: Mesh) => {
  (mesh.material as MeshStandardMaterial).map = mockTexture;
};
const mockClearTexture = (mesh: Mesh) => {
  (mesh.material as MeshStandardMaterial).map = null;
};

vi.mock('../../../hooks/useTwinMakerTextureLoader', () => ({ default: vi.fn() }));

vi.mock('../../../store/', async () => ({
  ...(await vi.importActual('../../../store/')),
  useEditorState: vi.fn(),
}));

const mockHandleAddWidget = vi.fn();

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
    vi.resetAllMocks();
    (useFrame as Mock).mockImplementation((cb) => cb());
    (useTwinMakerTextureLoader as Mock).mockImplementation(() => ({
      loadTextureOnMesh: mockLoadTexture,
      clearTextureOnMesh: mockClearTexture,
    }));
    (useAddWidget as Mock).mockImplementation(() => ({
      handleAddWidget: mockHandleAddWidget,
    }));
    (useEditorState as Mock).mockImplementation(() => ({
      isEditing: vi.fn().mockReturnValue(true),
      addingWidget: true,
    }));
  };

  beforeEach(() => {
    setup();
  });

  it(`should render`, () => {
    (useRef as Mock).mockImplementation(() => ({ current: undefined }));
    const { container } = render(<PlaneGeometryComponent component={component} node={baseNode} />);

    expect(container).toMatchSnapshot();
  });

  it(`should render with predefined color`, async () => {
    (useRef as Mock).mockReturnValue({ current: null });
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
    (useRef as Mock).mockReturnValue({ current: mesh });
    const rendered = await ReactThreeTestRenderer.create(
      <PlaneGeometryComponent component={componentWithTexture} node={baseNode} />,
    );
    const renderedMaterial = (rendered.scene.children[0].children[0].instance as Mesh).material as MeshStandardMaterial;
    expect(renderedMaterial.map?.name).toEqual(mockTexture.name);
  });

  it('should trigger on click', async () => {
    (useRef as Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(
      <PlaneGeometryComponent component={componentWithColor} node={baseNode} />,
    );
    const mesh = rendered.scene.children[0].children[0];
    await rendered.fireEvent(mesh, 'click', { delta: 0.1 });
    expect(mockHandleAddWidget).toBeCalled();
  });
});
