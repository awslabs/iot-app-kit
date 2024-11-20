import * as React from 'react';
import { useRef } from 'react';
import { create } from 'react-test-renderer';

import { DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_SETTINGS } from '../../../../common/constants';
import { KnownComponentType } from '../../../../interfaces';
import { accessStore } from '../../../../store';
import { CameraPreview } from '../index';

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei/core/PerspectiveCamera', () => ({
  PerspectiveCamera: 'PerspectiveCamera',
}));

describe('CameraPreview', () => {
  const node = {
    ref: 'test-ref',
    name: 'Test Camera',
    components: [
      {
        type: KnownComponentType.Camera,
        cameraType: 'perspective',
        ...DEFAULT_CAMERA_SETTINGS,
      },
    ],
    transform: {
      position: DEFAULT_CAMERA_POSITION,
    },
  };

  it('should render correctly', () => {
    accessStore('default').setState({
      selectedSceneNodeRef: 'test-ref',
      getSceneNodeByRef: vi.fn().mockReturnValue(node),
    });

    const TestComponent: React.FC = () => {
      const div = useRef(document.createElement('div'));

      return <CameraPreview track={div} />;
    };

    const container = create(<TestComponent />);

    expect(container).toMatchSnapshot();
  });
});
