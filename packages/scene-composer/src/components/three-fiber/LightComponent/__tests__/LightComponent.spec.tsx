/* eslint-disable import/first */
/* eslint-disable import/order */
import React from 'react';
import renderer from 'react-test-renderer';

import LightComponent from '..';
import { LightType } from '../../../../models/SceneModels';

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
  } as any;

  [
    ['Point', LightType.Point],
    ['Directional', LightType.Directional],
    ['Ambient', LightType.Ambient],
    ['Hemisphere', LightType.Hemisphere],
    ['Unknown', 'Unknown'],
  ].forEach((value) => {
    it(`should render correctly for ${value[0]} light`, () => {
      const container = renderer.create(
        <LightComponent
          node={{ name: 'Light' } as any}
          component={{ ref: 'light-ref', lightType: value[1] as any, lightSettings } as any}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
