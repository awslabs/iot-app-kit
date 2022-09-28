import React from 'react';
import renderer from 'react-test-renderer';

import CameraPreviewTrack from './CameraPreviewTrack';

describe('CameraPreviewTrack', () => {
  it('should render correctly', () => {
    const container = renderer.create(<CameraPreviewTrack title={'Test Title'} />);
    expect(container).toMatchSnapshot();
  });
});
