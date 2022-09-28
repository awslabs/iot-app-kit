import React from 'react';
import renderer from 'react-test-renderer';
import * as THREE from 'three';

import * as helpers from '../helpers';
import { CircularCylinderMotionIndicator } from '../CircularCylinderMotionIndicator';

describe('CircularCylinderMotionIndicator', () => {
  const baseProps: any = {
    scale: [1, 2, 3],
    config: { numOfRepeatInY: 1, backgroundColorOpacity: 0.6 },
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

    const container = renderer.create(<CircularCylinderMotionIndicator {...baseProps} />);
    container.update(<CircularCylinderMotionIndicator {...baseProps} />);

    expect(container).toMatchSnapshot();
  });
});
