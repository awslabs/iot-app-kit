import { render } from '@/tests/testing-library';
import { accessStore } from '../../store';
import { DisplayMessageCategory } from '../../store/internalInterfaces';
import MessageModal from './MessageModal';

import Mock = vi.Mock;

vi.mock('../../store', async () => {
  const originalModule = await vi.importActual('../../store');
  return {
    ...originalModule,
    accessStore: vi.fn(),
  };
});

describe('MessageModalSnap', () => {
  const clearMessages = vi.fn();
  const mockUseStore = accessStore as Mock;

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
