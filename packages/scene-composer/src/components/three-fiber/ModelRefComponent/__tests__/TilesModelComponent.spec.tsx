import { useFrame as mockUseFrame } from '@react-three/fiber';
import { render } from '@testing-library/react';
import * as THREE from 'three';

import { KnownComponentType } from '../../../../interfaces';
import { type IModelRefComponentInternal } from '../../../../store/internalInterfaces';
import { useTiles as mockUseTiles } from '../TilesLoader';
import { TilesModelComponent } from '../TilesModelComponent';

vi.mock('../TilesLoader', () => {
  return {
    useTiles: vi.fn(),
  };
});

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
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
    vi.resetAllMocks();
  };

  beforeEach(() => {
    setup();
  });

  it('should render TilesModelComponent', () => {
    const mockUpdate = vi.fn();
    (mockUseTiles as vi.Mock).mockReturnValue({ update: mockUpdate, group: baseScene });

    const { container } = render(<TilesModelComponent node={baseNode} component={baseComponent} />);

    expect(container).toMatchSnapshot();
  });

  it('should update renderer every frame', () => {
    const mockUpdate = vi.fn();

    (mockUseTiles as vi.Mock).mockReturnValue({ update: mockUpdate, group: baseScene });
    (mockUseFrame as vi.Mock).mockImplementation((cb) => cb()); // basically, let's cheat and just run it as soon as useFrame is setup so we can verify it's internals

    render(<TilesModelComponent node={baseNode} component={baseComponent} />);

    expect(mockUpdate).toBeCalled();
  });
});
