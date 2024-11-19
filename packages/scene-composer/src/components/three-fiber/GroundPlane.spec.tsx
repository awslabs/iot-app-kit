import { useRef } from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { type Mesh, Texture, type MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
vi.useFakeTimers();

import { useEditorState, accessStore } from '../../store';
import useTwinMakerTextureLoader from '../../hooks/useTwinMakerTextureLoader';

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
  const originalModule = await vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useFrame: vi.fn(),
  };
});

import GroundPlane from './GroundPlane';

vi.mock('../../utils/objectThreeUtils', () => {
  return {
    acceleratedRaycasting: vi.fn(),
  };
});

const mockTexture = new Texture();
mockTexture.name = 'testTextureName';

const mockLoadTexture = (uri, mesh: Mesh) => {
  (mesh.material as MeshStandardMaterial).map = mockTexture;
};
const mockClearTexture = (mesh: Mesh) => {
  (mesh.material as MeshStandardMaterial).map = null;
};

vi.mock('../../hooks/useTwinMakerTextureLoader', () => ({ default: vi.fn() }));

const mockHandleAddWidget = vi.fn();
vi.mock('../../hooks/useAddWidget', async () => ({
  default: () => ({ handleAddWidget: mockHandleAddWidget }),
}));

vi.mock('../../store/', async () => ({
  ...(await vi.importActual('../../store/')),
  useEditorState: vi.fn(),
}));

const getScenePropertyMock = vi.fn();
const baseState = {
  getSceneProperty: getScenePropertyMock,
};

describe('GroundPlane', () => {
  const setup = () => {
    vi.resetAllMocks();
    (useFrame as vi.Mock).mockImplementation((cb) => cb());
    (useTwinMakerTextureLoader as vi.Mock).mockImplementation(() => ({
      loadTextureOnMesh: mockLoadTexture,
      clearTextureOnMesh: mockClearTexture,
    }));

    accessStore('default').setState(baseState);
  };

  beforeEach(() => {
    setup();
  });

  it(`should not render with when not set and not in editing`, async () => {
    getScenePropertyMock.mockReturnValue(undefined);
    (useEditorState as vi.Mock).mockImplementation(() => ({
      isEditing: vi.fn().mockReturnValue(false),
      addingWidget: true,
    }));

    (useRef as vi.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(<GroundPlane />);
    expect(rendered.scene.children.length === 0);
  });

  it(`should render invisible when not enabled in editing`, async () => {
    getScenePropertyMock.mockReturnValue(undefined);
    (useEditorState as vi.Mock).mockImplementation(() => ({
      isEditing: vi.fn().mockReturnValue(true),
      addingWidget: true,
    }));

    (useRef as vi.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(<GroundPlane />);

    const material = (rendered.scene.children[0].instance as Mesh).material as MeshStandardMaterial;
    expect(material.transparent).toBeTruthy();
    expect(material.opacity).toBe(0);
  });

  it(`should render with predefined color`, async () => {
    getScenePropertyMock.mockReturnValue({ color: '#abcdef' });
    (useEditorState as vi.Mock).mockImplementation(() => ({
      isEditing: vi.fn().mockReturnValue(true),
      addingWidget: true,
    }));

    (useRef as vi.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(<GroundPlane />);
    const material = (rendered.scene.children[0].instance as Mesh).material as MeshStandardMaterial;
    expect(material.color.getHexString()).toBe('abcdef');
    expect(material.map).toBeNull();
  });

  it('should trigger on click', async () => {
    getScenePropertyMock.mockReturnValue({ color: '#abcdef' });
    (useEditorState as vi.Mock).mockImplementation(() => ({
      isEditing: vi.fn().mockReturnValue(true),
      addingWidget: true,
    }));

    (useRef as vi.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(<GroundPlane />);
    const mesh = rendered.scene.children[0];
    await rendered.fireEvent(mesh, 'click', { delta: 0.1 });
    expect(mockHandleAddWidget).toBeCalled();
  });
});
