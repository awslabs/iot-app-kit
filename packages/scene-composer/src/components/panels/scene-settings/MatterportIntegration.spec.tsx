import { render } from '@/tests/testing-library';

import { KnownSceneProperty } from '../../../interfaces';
import { accessStore } from '../../../store';

import { MatterportIntegration } from './MatterportIntegration';

describe('MatterportIntegration', () => {
  const setScenePropertyMock = vi.fn();
  const getScenePropertyMock = vi.fn();
  const isViewingMock = vi.fn();
  const setTagSettingsMock = vi.fn();
  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
    isViewing: isViewingMock,
    noHistoryStates: {
      ...accessStore('default').getState().noHistoryStates,
      setTagSettings: setTagSettingsMock,
    },
  };

  beforeEach(() => {
    vi.useRealTimers();
    getScenePropertyMock.mockReturnValue({
      [KnownSceneProperty.MatterportModelId]: 'matterport-model-id',
    });
    vi.clearAllMocks();
  });

  it('should render correctly', async () => {
    accessStore('default').setState(baseState);
    const { container } = render(<MatterportIntegration />);

    expect(container).toMatchSnapshot();
  });
});
