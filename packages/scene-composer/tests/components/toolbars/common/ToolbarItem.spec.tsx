import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { ToolbarItem } from '../../../../src/components/toolbars/common/ToolbarItem';

// NOTE: These tests only cover the areas not covered by some tests using this as a dependency
//  The remaining coverage comes from those.
describe('ToolbarItem', () => {
  const testMenuItem = {
    label: 'Test Item 1',
    text: 'item1',
    uuid: 'item1',
  };
  const testMenuItemWithSubItem = {
    label: 'Test Item 2',
    text: 'item2',
    uuid: 'item2',
    subItems: [
      {
        label: 'Test sub item 1',
        text: 'sub item 1',
        uuid: 'sub-item1',
      },
    ],
  };
  const setSelectedItem = jest.fn();
  const setShowMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show menu on pointerDown', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([testMenuItem, setSelectedItem]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowMenu]);
    render(<ToolbarItem items={[testMenuItem]} type='action-select' />);

    fireEvent.pointerDown(screen.getByTestId('item1'));

    expect(setShowMenu).toBeCalledWith(true);
  });

  it('should hide menu on pointerDown outside', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([testMenuItem, setSelectedItem]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowMenu]);
    render(<ToolbarItem items={[testMenuItem]} type='action-select' />);

    fireEvent.pointerDown(document.body);

    expect(setShowMenu).toBeCalledWith(false);
  });

  it('should trigger onClick when clicking on sub menu item', () => {
    const onClick = jest.fn();
    render(<ToolbarItem items={[testMenuItem, testMenuItemWithSubItem]} type='action-select' onClick={onClick} />);

    fireEvent.pointerUp(screen.getByTestId('sub-item1'));

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(testMenuItemWithSubItem.subItems[0]);
  });
});
