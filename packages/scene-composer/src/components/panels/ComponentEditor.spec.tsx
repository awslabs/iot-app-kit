import { render } from '@testing-library/react';

import { KnownComponentType } from '../../interfaces';
import { type ISceneNodeInternal } from '../../store/internalInterfaces';

import { ComponentEditor, DefaultComponentEditor } from './ComponentEditor';

vi.mock('./scene-components/AnchorComponentEditor', () => ({
  AnchorComponentEditor: (props) => <div data-mocked='AnchorComponentEditor'>{JSON.stringify(props)}</div>,
}));

vi.mock('./scene-components/LightComponentEditor', () => ({
  LightComponentEditor: (props) => <div data-mocked='LightComponentEditor'>{JSON.stringify(props)}</div>,
}));

vi.mock('./scene-components/AnimationComponentEditor', () => ({
  AnimationComponentEditor: (props) => <div data-mocked='AnimationComponentEditor'>{JSON.stringify(props)}</div>,
}));

vi.mock('./scene-components/ColorOverlayComponentEditor', () => ({
  ColorOverlayComponentEditor: (props) => <div data-mocked='ColorOverlayComponentEditor'>{JSON.stringify(props)}</div>,
}));

vi.mock('./scene-components/ModelRefComponentEditor', () => ({
  ModelRefComponentEditor: (props) => <div data-mocked='ModelRefComponentEditor'>{JSON.stringify(props)}</div>,
}));

vi.mock('./scene-components/MotionIndicatorComponentEditor', () => ({
  MotionIndicatorComponentEditor: (props) => (
    <div data-mocked='MotionIndicatorComponentEditor'>{JSON.stringify(props)}</div>
  ),
}));

vi.mock('./scene-components/CameraComponentEditor', () => (props) => (
  <div data-mocked='CameraComponentEditor'>{JSON.stringify(props)}</div>
));

vi.mock('./scene-components/DataOverlayComponentEditor', () => ({
  DataOverlayComponentEditor: (props) => <div data-mocked='DataOverlayComponentEditor'>{JSON.stringify(props)}</div>,
}));

vi.mock('./scene-components/EntityBindingComponentEditor', () => ({
  EntityBindingComponentEditor: (props) => (
    <div data-mocked='EntityBindingComponentEditor'>{JSON.stringify(props)}</div>
  ),
}));

vi.mock('./scene-components/PlaneGeometryComponentEditor', () => ({
  PlaneGeometryComponentEditor: (props) => (
    <div data-mocked='PlaneGeometryComponentEditor'>{JSON.stringify(props)}</div>
  ),
}));

describe('ComponentEditor renders correct component', () => {
  it('render DefaultComponentEditor correctly', async () => {
    const { container } = render(
      <DefaultComponentEditor node={{} as ISceneNodeInternal} component={{ ref: 'refId', type: 'random' }} />,
    );

    expect(container).toMatchSnapshot();
  });

  Object.keys(KnownComponentType).forEach((editorType) => {
    it(`should render the "${editorType}" editor correctly`, () => {
      const { container } = render(
        <ComponentEditor
          node={{} as ISceneNodeInternal}
          component={{ ref: 'refId', type: KnownComponentType[editorType] }}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
