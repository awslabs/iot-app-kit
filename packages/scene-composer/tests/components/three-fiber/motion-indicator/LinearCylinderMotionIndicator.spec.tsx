import React from 'react';
import renderer from 'react-test-renderer';
import * as THREE from 'three';

import * as helpers from '../../../../src/components/three-fiber/motion-indicator/helpers';
import { LinearCylinderMotionIndicator } from '../../../../src/components/three-fiber/motion-indicator/LinearCylinderMotionIndicator';

describe('LinearCylinderMotionIndicator', () => {
  const baseProps: any = {
    scale: [1, 2, 3],
    config: { numOfRepeatInY: 5, backgroundColorOpacity: 0.6 },
    backgroundColor: new THREE.Color('red'),
    speed: 6,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', async () => {
    const mockTextureRef: any = {
      current: {},
    };
    jest.spyOn(helpers, 'useArrowTexture').mockReturnValue(mockTextureRef);

    const container = renderer.create(<LinearCylinderMotionIndicator {...baseProps} />);
    container.update(<LinearCylinderMotionIndicator {...baseProps} />);

    expect(container).toMatchSnapshot();
    expect(mockTextureRef.current.rotation).toEqual(0.5 * Math.PI);
  });
});
