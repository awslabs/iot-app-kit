import wrapper from '@cloudscape-design/components/test-utils/dom';

import { ColorSelectorCombo } from './ColorSelectorCombo';

import { act, render, screen, user, waitFor } from '@/tests/testing-library';

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

describe('ColorPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // FIXME: no longer passing after changing to vitest
  it.skip('calls onSelectColor when color is selected', async () => {
    const onSelectColorMock = vi.fn();
    render(<ColorSelectorCombo color='#FFFFFF' onSelectColor={onSelectColorMock} colorPickerLabel='Colors' />);
    const colorElement = screen.getByTestId('color-preview');
    await user.click(colorElement);
    await user.click(screen.getAllByTitle('#000000')[0]);
    expect(onSelectColorMock).toHaveBeenCalledWith('#000000');
  });

  it('calls handleHexCodeChange when hex code is entered', async () => {
    const onSelectColorMock1 = vi.fn();
    const { container } = render(
      <ColorSelectorCombo color='#FFFFFF' onSelectColor={onSelectColorMock1} colorPickerLabel='Colors' />,
    );
    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.findInput();
    expect(input).toBeDefined();

    const newColor = '#FF0000';
    act(() => {
      input?.setInputValue(newColor);
    });
    // Assert that onSelectColor is called with the entered hex code
    expect(onSelectColorMock1).toHaveBeenCalledWith('#FF0000');
  });
});
