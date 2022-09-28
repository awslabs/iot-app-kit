import renderer from 'react-test-renderer';
import React from 'react';

import { useStore } from '../../src/store';
import MessageModal from '../../src/components/MessageModal';
import { DisplayMessageCategory } from '../../src/store/internalInterfaces';

import Mock = jest.Mock;

jest.mock('../../src/store', () => {
  const originalModule = jest.requireActual('../../src/store');
  return {
    ...originalModule,
    useStore: jest.fn(),
  };
});

describe('MessageModalSnap', () => {
  const clearMessages = jest.fn();
  const mockUseStore = useStore as Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with info', () => {
    mockUseStore.mockReturnValueOnce(() => [{ category: DisplayMessageCategory.Info, messageText: 'Info Test' }]);
    mockUseStore.mockReturnValueOnce(() => clearMessages);

    const container = renderer.create(<MessageModal />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with warning', () => {
    mockUseStore.mockReturnValueOnce(() => [{ category: DisplayMessageCategory.Warning, messageText: 'Warning Test' }]);
    mockUseStore.mockReturnValueOnce(() => clearMessages);

    const container = renderer.create(<MessageModal />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with error', () => {
    mockUseStore.mockReturnValueOnce(() => [{ category: DisplayMessageCategory.Error, messageText: 'Error Test' }]);
    mockUseStore.mockReturnValueOnce(() => clearMessages);

    const container = renderer.create(<MessageModal />);
    expect(container).toMatchSnapshot();
  });
});
