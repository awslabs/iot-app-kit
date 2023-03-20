import React from 'react';
import { render } from '@testing-library/react';

import { useStore } from '../../../store';
import { KnownSceneProperty } from '../../../interfaces';

import { MatterportIntegration } from './MatterportIntegration';

describe('MatterportIntegration', () => {
  const setScenePropertyMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const isViewingMock = jest.fn();
  const setTagSettingsMock = jest.fn();
  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
    isViewing: isViewingMock,
    noHistoryStates: {
      ...useStore('default').getState().noHistoryStates,
      setTagSettings: setTagSettingsMock,
    },
  };

  beforeEach(() => {
    jest.useRealTimers();
    getScenePropertyMock.mockReturnValue({
      [KnownSceneProperty.MatterportModelId]: 'matterport-model-id',
    });
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    useStore('default').setState(baseState);
    const { container } = render(<MatterportIntegration />);

    expect(container).toMatchSnapshot();
  });
});
