import React from 'react';
import { render } from '@testing-library/react';

import { KnownComponentType } from '../../../../interfaces';
import {
  ISceneComponentInternal,
  IModelRefComponentInternal,
  ISubModelRefComponentInternal,
  IAnchorComponentInternal,
  ICameraComponentInternal,
  ILightComponentInternal,
  IMotionIndicatorComponentInternal,
  IColorOverlayComponentInternal,
} from '../../../../store';
import ComponentGroup from '../ComponentGroup';
import { fakeSceneNode } from '../fakers';

jest.mock('../../ModelRefComponent', () => 'ModelRefComponent');
jest.mock('../../AnchorComponent', () => 'AnchorComponent');
jest.mock('../../CameraComponent', () => 'CameraComponent');
jest.mock('../../LightComponent', () => 'LightComponent');
jest.mock('../../MotionIndicatorComponent', () => 'MotionIndicatorComponent');
jest.mock('../../ColorOverlayComponent', () => 'ColorOverlayComponent');
jest.mock('../../SubModelComponent', () => 'SubModelComponent');

describe('<ComponentGroup />', () => {
  it('should render the appropriate view', () => {
    const components = [
      { type: KnownComponentType.ModelRef, ref: '0' } as IModelRefComponentInternal,
      { type: KnownComponentType.SubModelRef, ref: '1' } as ISubModelRefComponentInternal,
      { type: KnownComponentType.Tag, ref: '2' } as IAnchorComponentInternal,
      { type: KnownComponentType.Camera, ref: '3' } as ICameraComponentInternal,
      { type: KnownComponentType.Light, ref: '4' } as ILightComponentInternal,
      { type: KnownComponentType.MotionIndicator, ref: '5' } as IMotionIndicatorComponentInternal,
      { type: KnownComponentType.ModelShader, ref: '6' } as IColorOverlayComponentInternal,
    ] as ISceneComponentInternal[];

    const node = fakeSceneNode('ref');
    components.forEach((c) => node.components.push(c));

    const { container } = render(<ComponentGroup components={components} node={node} />);

    expect(container).toMatchSnapshot();
  });
});
