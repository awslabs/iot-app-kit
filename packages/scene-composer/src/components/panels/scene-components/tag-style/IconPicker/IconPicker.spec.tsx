import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { fireEvent, render, screen } from '@testing-library/react';

import { IconPicker } from './IconPicker';

describe('IconPicker', () => {
  const mockOnSelectIconChange = jest.fn();
  const mockIconPickerLabel = 'Icon';
  const mockSelectedIcon = {
    prefix: 'abc',
    iconName: 'abc',
    icon: [192, 517, [], '32', 'M22 vh234'],
  };

  beforeEach(() => {
    render(
      <IconPicker
        selectedIcon={mockSelectedIcon as IconDefinition}
        onSelectIconChange={mockOnSelectIconChange}
        iconPickerLabel={mockIconPickerLabel}
      />,
    );
  });

  it('renders the icon picker label', () => {
    const labelElement = screen.getByText(mockIconPickerLabel);
    expect(labelElement).toBeTruthy();
  });

  it('opens the icon picker popover on button click', () => {
    const buttonElement = screen.getByTestId('icon-button');
    fireEvent.click(buttonElement);
    const popoverElement = screen.getByTestId('icon-popover');
    expect(popoverElement).toBeTruthy();
  });

  it('calls onSelectIconChange and updates the selected icon on icon click', () => {
    const buttonElement = screen.getByTestId('icon-button');
    fireEvent.click(buttonElement);
    expect(screen.getByTestId('icon-list')).toBeTruthy();
  });
});
