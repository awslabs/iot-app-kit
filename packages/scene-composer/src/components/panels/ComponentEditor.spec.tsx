import React from 'react';
import { render } from '@testing-library/react';

import { KnownComponentType } from '../../interfaces';

import { ComponentEditor, DefaultComponentEditor } from './ComponentEditor';

jest.mock('./scene-components/AnchorComponentEditor', () => ({
  AnchorComponentEditor: (props) => <div data-mocked='AnchorComponentEditor' {...props} />,
}));

jest.mock('./scene-components/LightComponentEditor', () => ({
  LightComponentEditor: (props) => <div data-mocked='LightComponentEditor' {...props} />,
}));

jest.mock('./scene-components/ColorOverlayComponentEditor', () => ({
  ColorOverlayComponentEditor: (props) => <div data-mocked='ColorOverlayComponentEditor' {...props} />,
}));

jest.mock('./scene-components/ModelRefComponentEditor', () => ({
  ModelRefComponentEditor: (props) => <div data-mocked='ModelRefComponentEditor' {...props} />,
}));

jest.mock('./scene-components/MotionIndicatorComponentEditor', () => ({
  MotionIndicatorComponentEditor: (props) => <div data-mocked='MotionIndicatorComponentEditor' {...props} />,
}));

jest.mock('./scene-components/CameraComponentEditor', () => (props) => (
  <div data-mocked='CameraComponentEditor' {...props} />
));

jest.mock('./scene-components/DataOverlayComponentEditor', () => ({
  DataOverlayComponentEditor: (props) => <div data-mocked='DataOverlayComponentEditor' {...props} />,
}));

describe('ComponentEditor renders correct component', () => {
  it('render DefaultComponentEditor correctly', async () => {
    const { container } = render(<DefaultComponentEditor node={{} as any} component={{ ref: 'refId' } as any} />);

    expect(container).toMatchSnapshot();
  });

  Object.keys(KnownComponentType).forEach((editorType) => {
    it(`should render the "${editorType}" editor correctly`, () => {
      const { container } = render(
        <ComponentEditor node={{} as any} component={{ ref: 'refId', type: KnownComponentType[editorType] }} />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
