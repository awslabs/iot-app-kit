import * as THREE from 'three';
import { render } from '@testing-library/react';
import { useFrame as mockUseFrame } from '@react-three/fiber';

import { TilesModelComponent } from '../TilesModelComponent';
import { KnownComponentType } from '../../../../interfaces';
import { type IModelRefComponentInternal } from '../../../../store/internalInterfaces';
import { useTiles as mockUseTiles } from '../TilesLoader';

jest.mock('../TilesLoader', () => {
  return {
    useTiles: jest.fn(),
  };
});

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

describe('TilesModelComponent', () => {
  const baseNode: any = {
    ref: 'mock-node',
  };
  const baseComponent: IModelRefComponentInternal = {
    ref: 'mock-comp',
    type: KnownComponentType.ModelRef,
    uri: 'mock/uri',
    modelType: 'Tiles3D',
  };
  const mockObject = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  mockObject.name = 'mockObject';
  const baseScene = new THREE.Group();
  baseScene.add(mockObject);

  const setup = () => {
    jest.resetAllMocks();
  };

  beforeEach(() => {
    setup();
  });

  it('should render TilesModelComponent', () => {
    const mockUpdate = jest.fn();
    (mockUseTiles as jest.Mock).mockReturnValue({ update: mockUpdate, group: baseScene });

    const { container } = render(<TilesModelComponent node={baseNode} component={baseComponent} />);

    expect(container).toMatchSnapshot();
  });

  it('should update renderer every frame', () => {
    const mockUpdate = jest.fn();

    (mockUseTiles as jest.Mock).mockReturnValue({ update: mockUpdate, group: baseScene });
    (mockUseFrame as jest.Mock).mockImplementation((cb) => cb()); // basically, let's cheat and just run it as soon as useFrame is setup so we can verify it's internals

    render(<TilesModelComponent node={baseNode} component={baseComponent} />);

    expect(mockUpdate).toBeCalled();
  });
});
