import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ColorSelectorCombo } from './ColorSelectorCombo';

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

describe('ColorPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onSelectColor when color is selected', () => {
    const onSelectColorMock = jest.fn();
    render(<ColorSelectorCombo color='#FFFFFF' onSelectColor={onSelectColorMock} colorPickerLabel='Colors' />);
    const colorElement = screen.getByTestId('color-preview');
    fireEvent.click(colorElement);
    fireEvent.click(screen.getAllByTitle('#000000')[0]);
    expect(onSelectColorMock).toHaveBeenCalledWith('#000000');
  });

  it('calls handleHexCodeChange when hex code is entered', async () => {
    const onSelectColorMock1 = jest.fn();
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
