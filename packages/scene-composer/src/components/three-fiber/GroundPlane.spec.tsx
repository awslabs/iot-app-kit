import React, { useRef } from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Mesh, Texture, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
jest.useFakeTimers();

import { useEditorState, useStore } from '../../store';
import useTwinMakerTextureLoader from '../../hooks/useTwinMakerTextureLoader';
import useAddWidget from '../../hooks/useAddWidget';
import { DEFAULT_GROUND_PLANE_COLOR, KnownSceneProperty } from '../../interfaces';

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
    useFrame: jest.fn(),
  };
});

import GroundPlane from './GroundPlane';

jest.mock('../../utils/objectThreeUtils', () => {
  return {
    acceleratedRaycasting: jest.fn(),
  };
});

jest.mock('../../hooks/useAddWidget', () => {
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

jest.mock('../../hooks/useTwinMakerTextureLoader', () => {
  return jest.fn();
});

jest.mock('../../hooks/useAddWidget', () => {
  return jest.fn();
});

jest.mock('../../store/', () => ({
  ...jest.requireActual('../../store/'),
  useEditorState: jest.fn(),
}));

const mockHandleAddWidget = jest.fn();

const setScenePropertyMock = jest.fn();
const getScenePropertyMock = jest.fn();
const baseState = {
  getSceneProperty: getScenePropertyMock,
  setSceneProperty: setScenePropertyMock,
};

describe('GroundPlane', () => {
  const setup = () => {
    jest.resetAllMocks();
    (useFrame as jest.Mock).mockImplementation((cb) => cb());
    (useTwinMakerTextureLoader as jest.Mock).mockImplementation(() => ({
      loadTextureOnMesh: mockLoadTexture,
      clearTextureOnMesh: mockClearTexture,
    }));
    (useAddWidget as jest.Mock).mockImplementation(() => ({
      handleAddWidget: mockHandleAddWidget,
    }));

    useStore('default').setState(baseState);
  };

  beforeEach(() => {
    setup();
  });

  it(`should not render with when not set and not in editing`, async () => {
    getScenePropertyMock.mockReturnValue(undefined);
    (useEditorState as jest.Mock).mockImplementation(() => ({
      isEditing: jest.fn().mockReturnValue(false),
      addingWidget: true,
    }));

    (useRef as jest.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(<GroundPlane />);
    expect(rendered.scene.children.length === 0);
  });

  it(`should render invisible when not enabled in editing`, async () => {
    getScenePropertyMock.mockReturnValue(undefined);
    (useEditorState as jest.Mock).mockImplementation(() => ({
      isEditing: jest.fn().mockReturnValue(true),
      addingWidget: true,
    }));

    (useRef as jest.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(<GroundPlane />);

    const material = (rendered.scene.children[0].instance as Mesh).material as MeshStandardMaterial;
    expect(material.transparent).toBeTruthy();
    expect(material.opacity).toBe(0);
  });

  it(`should render with predefined color`, async () => {
    getScenePropertyMock.mockReturnValue({ color: '#abcdef' });
    (useEditorState as jest.Mock).mockImplementation(() => ({
      isEditing: jest.fn().mockReturnValue(true),
      addingWidget: true,
    }));

    (useRef as jest.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(<GroundPlane />);
    const material = (rendered.scene.children[0].instance as Mesh).material as MeshStandardMaterial;
    expect(material.color.getHexString()).toBe('abcdef');
    expect(material.map).toBeNull();
  });

  it('should trigger on click', async () => {
    getScenePropertyMock.mockReturnValue({ color: '#abcdef' });
    (useEditorState as jest.Mock).mockImplementation(() => ({
      isEditing: jest.fn().mockReturnValue(true),
      addingWidget: true,
    }));

    (useRef as jest.Mock).mockReturnValue({ current: null });
    const rendered = await ReactThreeTestRenderer.create(<GroundPlane />);
    const mesh = rendered.scene.children[0];
    await rendered.fireEvent(mesh, 'click', { delta: 0.1 });
    expect(mockHandleAddWidget).toBeCalled();
  });

  it(`should fix invalid values back to default`, async () => {
    getScenePropertyMock.mockReturnValue({
      color: 'NOTHEX',
      textureUri: 'TE\n\nST',
      opacity: -1,
    });
    (useEditorState as jest.Mock).mockImplementation(() => ({
      isEditing: jest.fn().mockReturnValue(true),
      addingWidget: true,
    }));

    (useRef as jest.Mock).mockReturnValue({ current: null });
    await ReactThreeTestRenderer.create(<GroundPlane />);

    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.GroundPlaneSettings, {
      color: DEFAULT_GROUND_PLANE_COLOR,
      opacity: 0,
      textureUri: 'TE\n\nST',
    });
  });
});
