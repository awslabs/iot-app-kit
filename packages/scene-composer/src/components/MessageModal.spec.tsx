import React from 'react';
import { render } from '@testing-library/react';

import { useStore } from '../store';
import { DisplayMessageCategory } from '../store/internalInterfaces';

import MessageModal from './MessageModal';

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

  [
    { category: DisplayMessageCategory.Info, messageText: 'Info Test' },
    { category: DisplayMessageCategory.Warning, messageText: 'Warning Test' },
    { category: DisplayMessageCategory.Error, messageText: 'Error Test' },
  ].map((props) => {
    it(`should render correctly with: ${props}`, () => {
      mockUseStore.mockReturnValueOnce(() => [props]);
      mockUseStore.mockReturnValueOnce(() => clearMessages);

      const { container } = render(<MessageModal />);
      expect(container).toMatchSnapshot();
    });
  });
});
