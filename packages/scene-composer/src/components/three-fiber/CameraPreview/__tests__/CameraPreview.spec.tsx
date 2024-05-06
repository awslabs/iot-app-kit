import React from 'react';
import { create } from 'react-test-renderer';

import { CameraPreview } from '../index';
import { accessStore } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';
import { DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_SETTINGS } from '../../../../common/constants';

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei/core/PerspectiveCamera', () => ({
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
      getSceneNodeByRef: jest.fn().mockReturnValue(node),
    });

    const TestComponent: React.FC = () => {
      const div = React.useRef(document.createElement('div'));

      return <CameraPreview track={div} />;
    };

    const container = create(<TestComponent />);

    expect(container).toMatchSnapshot();
  });
});
