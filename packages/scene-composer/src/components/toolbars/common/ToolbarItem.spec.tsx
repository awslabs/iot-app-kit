import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ue from '@testing-library/user-event';
import * as React from 'react';

import { ToolbarItem } from './ToolbarItem';

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
  const testMenuItemsFlat = [
    {
      label: 'Test Item 1',
      text: 'item1',
      uuid: 'item1',
    },
    {
      label: 'Test Item 2',
      text: 'item2',
      uuid: 'item2',
    },
    {
      label: 'Test Item 3',
      text: 'item3',
      uuid: 'item3',
    },
  ];
  const setSelectedItem = vi.fn();
  const setShowMenu = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.skip('should show menu on pointerDown', () => {
    vi.spyOn(React, 'useState').mockReturnValueOnce([testMenuItem, setSelectedItem]);
    vi.spyOn(React, 'useState').mockReturnValueOnce([false, setShowMenu]);
    render(<ToolbarItem items={[testMenuItem]} type='action-select' menuPosition='bottom-right' />);

    fireEvent.pointerDown(screen.getByTestId('item1'));

    expect(setShowMenu).toBeCalledWith(true);
  });

  it.skip('should hide menu on pointerDown outside', () => {
    vi.spyOn(React, 'useState').mockReturnValueOnce([testMenuItem, setSelectedItem]);
    vi.spyOn(React, 'useState').mockReturnValueOnce([true, setShowMenu]);
    render(<ToolbarItem items={[testMenuItem]} type='action-select' />);

    fireEvent.pointerDown(document.body);

    expect(setShowMenu).toBeCalledWith(false);
  });

  it('should trigger onClick when clicking on sub menu item', () => {
    const onClick = vi.fn();
    render(<ToolbarItem items={[testMenuItem, testMenuItemWithSubItem]} type='action-select' onSelect={onClick} />);

    fireEvent.pointerUp(screen.getByTestId('sub-item1'));

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(testMenuItemWithSubItem.subItems[0]);
  });

  it('should focus first element after menu opens', async () => {
    const user = ue.setup();
    const onKeyDown = vi.fn();
    render(<ToolbarItem items={testMenuItemsFlat} type='action-select' onSelect={onKeyDown} />);

    // focus menu item container
    screen.getByTestId('item1').focus();
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByTestId('item2'));
    });
  });

  it('should navigate focus between menu items with keyboard', async () => {
    const user = ue.setup();
    const onKeyDown = vi.fn();
    render(<ToolbarItem items={testMenuItemsFlat} type='action-select' onSelect={onKeyDown} />);

    screen.getByTestId('item1').focus();
    await user.keyboard('{Enter}');

    await user.keyboard('{Tab}');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByTestId('item3'));
    });

    // hold shift, hit tab, release shift
    await user.keyboard('[ShiftLeft>]');
    await user.keyboard('{Tab}');
    await user.keyboard('[/ShiftLeft]');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByTestId('item2'));
    });

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByTestId('item1'));
    });
  });
  it('should trap focus in menu', async () => {
    const user = ue.setup();
    const onKeyDown = vi.fn();
    render(<ToolbarItem items={testMenuItemsFlat} type='action-select' onSelect={onKeyDown} />);

    screen.getByTestId('item1').focus();
    await user.keyboard('{Enter}');

    await user.keyboard('{Tab}');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByTestId('item3'));
    });
    // tabbing on last item in menu should return focus to first item
    await user.keyboard('{Tab}');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByTestId('item2'));
    });

    // shift tabbing first item in menu should return focus to last item
    await user.keyboard('[ShiftLeft>]');
    await user.keyboard('{Tab}');
    await user.keyboard('[/ShiftLeft]');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByTestId('item3'));
    });
  });
});
