/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';
import * as THREE from 'three';

import { calculateCenterPosition, LoadingProgress } from '../../../src/components/three-fiber/LoadingProgress';

function mockComponent(componentName) {
  return (props) => {
    const snapshotableProps = {};
    Object.entries(props).forEach(([key, value]) => {
      try {
        // Covers edge case where stringify fails due to circular object graphs
        if (typeof value === 'object') {
          snapshotableProps[key] = JSON.stringify(value);
        } else {
          snapshotableProps[key] = value;
        }
      } catch (e) {
        snapshotableProps[key] = value;
      }
    });

    return <div data-mocked={componentName} {...snapshotableProps} />;
  };
}

jest.mock('@awsui/components-react', () => {
  return {
    Box: mockComponent('Box'),
    Container: mockComponent('Container'),
    ProgressBar: mockComponent('ProgressBar'),
  };
});

jest.mock('@react-three/drei/web/Html', () => {
  return {
    Html: mockComponent('Html'),
  };
});

jest.mock('../../../src/components/three-fiber/hooks/useProgress', () => () => ({
  downloadItem: 'file.jpg',
  dowloaded: true,
  progess: 50,
}));

describe('<LoadingProgress />', () => {
  it('should render loading indicator', () => {
    const { container } = render(<LoadingProgress />);

    expect(container).toMatchSnapshot();
  });

  describe('calculateCenterPosition', () => {
    it('should properly calcualte center position based on the size of the threejs element', () => {
      const size = { width: 100, height: 100 };

      const [width, height] = calculateCenterPosition({} as THREE.Object3D, {} as THREE.Camera, size);

      expect(width).toEqual(50);
      expect(height).toEqual(50);
    });
  });
});
