import { create } from 'react-test-renderer';

import CameraPreviewTrack from './CameraPreviewTrack';

describe('CameraPreviewTrack', () => {
  it('should render correctly', () => {
    const container = create(<CameraPreviewTrack title='Test Title' />);
    expect(container).toMatchSnapshot();
  });
});
