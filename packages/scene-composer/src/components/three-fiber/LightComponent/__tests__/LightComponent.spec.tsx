/* eslint-disable import/first */
/* eslint-disable import/order */
import { create } from 'react-test-renderer';

import LightComponent from '..';
import { type Component, LightType } from '../../../../models/SceneModels';
import { type ISceneNodeInternal } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
    useFrame: jest.fn().mockImplementation((callback) => callback()),
  };
});

describe('LightComponent', () => {
  const lightSettings = {
    color: 'white',
    intensity: 1,
    castShadow: true,
    distance: 100,
    decay: 0.1,
    groundColor: 'white',
  } as Component.ILightSettings;

  [
    ['Point', LightType.Point],
    ['Directional', LightType.Directional],
    ['Ambient', LightType.Ambient],
    ['Hemisphere', LightType.Hemisphere],
    ['Unknown', 'Unknown'],
  ].forEach((value) => {
    it(`should render correctly for ${value[0]} light`, () => {
      const container = create(
        <LightComponent
          node={{ name: 'Light' } as ISceneNodeInternal}
          component={{
            ref: 'light-ref',
            type: KnownComponentType.Light,
            lightType: value[1] as LightType,
            lightSettings,
          }}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
