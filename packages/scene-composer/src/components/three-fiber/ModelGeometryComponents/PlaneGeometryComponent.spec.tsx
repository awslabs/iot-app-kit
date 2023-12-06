import React, { useRef } from 'react';
import { render } from '@testing-library/react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Scene, Camera, Mesh, Texture, MeshStandardMaterial } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
jest.useFakeTimers();

import { KnownComponentType } from '../../../interfaces';
import { IPlaneGeometryComponentInternal, ISceneNodeInternal, useEditorState } from '../../../store';
import useTwinMakerTextureLoader from '../../../hooks/useTwinMakerTextureLoader';
import useAddWidget from '../../../hooks/useAddWidget';

//we need actual drei code to test with r3f renderer
jest.mock('@react-three/drei', () => {
  const originalModule = jest.requireActual('@react-three/drei');
  return {
    ...originalModule,
  };
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(),
}));

// Mock Hooks
jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
    useFrame: jest.fn(),
  };
});

import PlaneGeometryComponent from './PlaneGeometryComponent';

jest.mock('../../../utils/objectThreeUtils', () => {
  return {
    acceleratedRaycasting: jest.fn(),
    getComponentGroupName: jest.fn().mockReturnValue('mockComponentGroupName'),
  };
});

jest.mock('../../../hooks/useAddWidget', () => {
  return jest.fn();
});

const mockTexture = new Texture();
mockTexture.name = 'testTextureName';

const mockLoadTexture = (uri, mesh: Mesh) => {
  (mesh.material as MeshStandardMaterial).map = mockTexture;
};
const mockClearTexture = (mesh: Mesh) => {
  (mesh.material as MeshStandardMaterial).map = null;
};

jest.mock('../../../hooks/useTwinMakerTextureLoader', () => {
  return jest.fn();
});

jest.mock('../../../hooks/useAddWidget', () => {
  return jest.fn();
});

jest.mock('../../../store/', () => ({
  ...jest.requireActual('../../../store/'),
  useEditorState: jest.fn(),
}));

const mockHandleAddWidget = jest.fn();

describe('PlaneGeometryComponent', () => {
  const mockThreeStates = {
    camera: new Camera(),
    scene: new Scene(),
  };

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
    jest.resetAllMocks();
    (useThree as jest.Mock).mockReturnValue(mockThreeStates);
    (useFrame as jest.Mock).mockImplementation((cb) => cb());
    (useTwinMakerTextureLoader as jest.Mock).mockImplementation(() => ({
      loadTextureOnMesh: mockLoadTexture,
      clearTextureOnMesh: mockClearTexture,
    }));
    (useAddWidget as jest.Mock).mockImplementation(() => ({
      handleAddWidget: mockHandleAddWidget,
    }));
    (useEditorState as jest.Mock).mockImplementation(() => ({
      isEditing: jest.fn().mockReturnValue(true),
      addingWidget: true,
    }));
  };

  beforeEach(() => {
    setup();
  });

  it(`should render`, () => {
    (useRef as jest.Mock).mockImplementation(() => ({ current: undefined }));
    const { container } = render(<PlaneGeometryComponent component={component} node={baseNode} />);

    expect(container).toMatchSnapshot();
  });

  it(`should render with predefined color`, async () => {
    (useRef as jest.Mock).mockReturnValue({ current: null });
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
    (useRef as jest.Mock).mockReturnValue({ current: mesh });
    const rendered = await ReactThreeTestRenderer.create(
      <PlaneGeometryComponent component={componentWithTexture} node={baseNode} />,
    );
    const renderedMaterial = (rendered.scene.children[0].children[0].instance as Mesh).material as MeshStandardMaterial;
    expect(renderedMaterial.map?.name).toEqual(mockTexture.name);
  });

  it('should trigger on click', async () => {
    (useRef as jest.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(
      <PlaneGeometryComponent component={componentWithColor} node={baseNode} />,
    );
    const mesh = rendered.scene.children[0].children[0];
    await rendered.fireEvent(mesh, 'click', { delta: 0.1 });
    expect(mockHandleAddWidget).toBeCalled();
  });
});
