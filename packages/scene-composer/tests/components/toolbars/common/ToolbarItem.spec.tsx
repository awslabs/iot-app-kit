import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { ToolbarItem } from '../../../../src/components/toolbars/common/ToolbarItem';

// NOTE: These tests only cover the areas not covered by some tests using this as a dependency
//  The remaining coverage comes from those.
describe('ToolbarItem', () => {
  const testMenuItem = {
    label: 'Test Item 1',
    text: { name: 'item1' },
    uuid: 'item1',
  };
  const setSelectedItem = jest.fn();
  const setShowMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show menu on pointerDown', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([testMenuItem, setSelectedItem]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowMenu]);
    render(<ToolbarItem items={testMenuItem as any} type={'action-select'} />);

    fireEvent.pointerDown(screen.getByTestId('item1'));

    expect(setShowMenu).toBeCalledWith(true);
  });

  it('should hide menu on pointerDown outside', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([testMenuItem, setSelectedItem]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowMenu]);
    render(<ToolbarItem items={testMenuItem as any} type={'action-select'} />);

    fireEvent.pointerDown(document.body);

    expect(setShowMenu).toBeCalledWith(false);
  });

  // TODO: Find a way to fix the tests that rely on pointerEnter and pointerLeave.
  //  https://github.com/testing-library/react-testing-library/issues/783
  //  Upgrading the testing-library did not help.
  it.skip('should show menu on pointerEnter', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([testMenuItem, setSelectedItem]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowMenu]);
    render(<ToolbarItem items={testMenuItem as any} type={'action-select'} />);

    fireEvent.pointerEnter(screen.getByTestId('item1'), { pointerType: 'mouse' });

    expect(setShowMenu).toBeCalledWith(true);
  });

  it.skip('should hide menu on pointerLeave', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([testMenuItem, setSelectedItem]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowMenu]);
    render(<ToolbarItem items={testMenuItem as any} type={'action-select'} />);

    fireEvent.pointerLeave(screen.getByTestId('item1'), { pointerType: 'mouse' });

    expect(setShowMenu).toBeCalledWith(false);
  });
});
