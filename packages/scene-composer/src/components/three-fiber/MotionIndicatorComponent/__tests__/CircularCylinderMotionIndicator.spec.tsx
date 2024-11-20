import { create } from 'react-test-renderer';
import * as THREE from 'three';

import { CircularCylinderMotionIndicator } from '../CircularCylinderMotionIndicator';
import * as helpers from '../helpers';

describe('CircularCylinderMotionIndicator', () => {
  const baseProps: any = {
    scale: [1, 2, 3],
    config: { numOfRepeatInY: 1, backgroundColorOpacity: 0.6 },
    backgroundColor: new THREE.Color('red'),
    speed: 6,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render correctly', async () => {
    const mockTextureRef: any = {
      current: {},
    };
    vi.spyOn(helpers, 'useArrowTexture').mockReturnValue(mockTextureRef);

    const container = create(<CircularCylinderMotionIndicator {...baseProps} />);
    container.update(<CircularCylinderMotionIndicator {...baseProps} />);

    expect(container).toMatchSnapshot();
  });
});
