import { render } from '@testing-library/react';

import { KnownComponentType } from '../../../../interfaces';
import {
  type IAnchorComponentInternal,
  type ICameraComponentInternal,
  type IColorOverlayComponentInternal,
  type IDataOverlayComponentInternal,
  type ILightComponentInternal,
  type IModelRefComponentInternal,
  type IMotionIndicatorComponentInternal,
  type ISceneComponentInternal,
  type ISubModelRefComponentInternal,
} from '../../../../store';
import ComponentGroup from '../ComponentGroup';
import { fakeSceneNode } from '../fakers';

vi.mock('../../ModelRefComponent', () => ({ default: 'ModelRefComponent' }));
vi.mock('../../AnchorComponent', () => ({ default: 'AnchorComponent' }));
vi.mock('../../CameraComponent', () => ({ default: 'CameraComponent' }));
vi.mock('../../LightComponent', () => ({ default: 'LightComponent' }));
vi.mock('../../MotionIndicatorComponent', () => ({ default: 'MotionIndicatorComponent' }));
vi.mock('../../ColorOverlayComponent', () => ({ default: 'ColorOverlayComponent' }));
vi.mock('../../SubModelComponent', () => ({ default: 'SubModelComponent' }));
vi.mock('../../DataOverlayComponent', () => ({ default: 'DataOverlayComponent' }));

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
      { type: KnownComponentType.DataOverlay, ref: '7' } as IDataOverlayComponentInternal,
    ] as ISceneComponentInternal[];

    const node = fakeSceneNode('ref');
    components.forEach((c) => node.components.push(c));

    const { container } = render(<ComponentGroup components={components} node={node} />);

    expect(container).toMatchSnapshot();
  });
});
