import {
  stateWithCopiedWidgets,
  stateWithHiddenContextMenu,
  stateWithSelectedWidgets,
  stateWithVisibleContextMenu,
  stateWithWidgets,
} from '#test/stateScenarios';
import {
  act,
  render,
  renderHook,
  screen,
  user,
  within,
} from '#test/testing-library';
import { ContextMenu } from './contextMenu';
import { useContextMenu } from './useContextMenu';

const getContextMenu = () => screen.getByRole('menu', { name: 'Context menu' });
const queryContextMenu = () =>
  screen.queryByRole('menu', { name: 'Context menu' });
const getMenuOption = (name: string) =>
  within(getContextMenu()).getByRole('button', { name });

function getMenuOptions() {
  return {
    copyMenuOption: getMenuOption('Copy'),
    pasteMenuOption: getMenuOption('Paste'),
    deleteMenuOption: getMenuOption('Delete'),
    bringToFrontMenuOption: getMenuOption('Bring to front'),
    sendToBackMenuOption: getMenuOption('Send to back'),
  };
}

test('useContextMenu may be used to open and close the context menu', () => {
  const { result, store } = renderHook(() => useContextMenu(), {
    preloadedState: stateWithHiddenContextMenu,
  });
  render(<ContextMenu />, { store });

  // the menu is initially closed
  expect(queryContextMenu()).not.toBeInTheDocument();
  // position is undefined when the menu is closed
  expect(result.current.position).toBeUndefined();

  // a handler may be used to open the context menu at a position
  const position = { x: 10, y: 20 };
  act(() => {
    result.current.open({ position });
  });

  // the menu is visible
  expect(getContextMenu()).toBeVisible();
  expect(result.current.position).toEqual(position);

  // a handler may be used to close the context menu
  act(() => {
    result.current.close();
  });

  // the menu is closed
  expect(queryContextMenu()).not.toBeInTheDocument();
  expect(result.current.position).toBeUndefined();
});

test('context menu closes when anything else besides the context menu is clicked', async () => {
  const testId = 'context-menu-container';
  const container = document.createElement('div');
  container.setAttribute('data-testid', testId);
  render(<ContextMenu />, {
    preloadedState: stateWithVisibleContextMenu,
    container: document.body.appendChild(container),
  });

  // user clicks outside of the context menu
  await user.click(screen.getByTestId(testId));

  // the menu is closed
  expect(queryContextMenu()).not.toBeInTheDocument();
});

describe('user DOES NOT HAVE selected widgets', () => {
  beforeEach(() => {
    render(<ContextMenu />, {
      preloadedState: [stateWithVisibleContextMenu, stateWithWidgets],
    });
  });

  test('user CAN NOT copy', async () => {
    const { copyMenuOption } = getMenuOptions();
    expect(copyMenuOption).toBeDisabled();
    await user.click(copyMenuOption);
    expect(getContextMenu()).toBeVisible();
  });

  test('user CAN NOT paste', async () => {
    const { pasteMenuOption } = getMenuOptions();
    expect(pasteMenuOption).toBeDisabled();
    await user.click(pasteMenuOption);
    expect(getContextMenu()).toBeVisible();
  });

  test('user CAN NOT delete', async () => {
    const { deleteMenuOption } = getMenuOptions();
    expect(deleteMenuOption).toBeDisabled();
    await user.click(deleteMenuOption);
    expect(getContextMenu()).toBeVisible();
  });

  test('user CAN NOT bring to front', async () => {
    const { bringToFrontMenuOption } = getMenuOptions();
    expect(bringToFrontMenuOption).toBeDisabled();
    await user.click(bringToFrontMenuOption);
    expect(getContextMenu()).toBeVisible();
  });

  test('user CAN NOT send to back', async () => {
    const { sendToBackMenuOption } = getMenuOptions();
    expect(sendToBackMenuOption).toBeDisabled();
    await user.click(sendToBackMenuOption);
    expect(getContextMenu()).toBeVisible();
  });
});

describe('user HAS selected widgets', () => {
  beforeEach(() => {
    render(<ContextMenu />, {
      preloadedState: [stateWithVisibleContextMenu, stateWithSelectedWidgets],
    });
  });

  test('user CAN copy selected widgets', async () => {
    const { copyMenuOption } = getMenuOptions();
    expect(copyMenuOption).toBeEnabled();
    await user.click(copyMenuOption);
    expect(queryContextMenu()).not.toBeInTheDocument();
  });

  test('user CAN NOT paste selected widgets', async () => {
    const { pasteMenuOption } = getMenuOptions();
    expect(pasteMenuOption).toBeDisabled();
    await user.click(pasteMenuOption);
    expect(getContextMenu()).toBeVisible();
  });

  test('user CAN delete selected widgets', async () => {
    const { deleteMenuOption } = getMenuOptions();
    expect(deleteMenuOption).toBeEnabled();
    await user.click(deleteMenuOption);
    expect(queryContextMenu()).not.toBeInTheDocument();
  });

  test('user CAN bring selected widgets to front', async () => {
    const { bringToFrontMenuOption } = getMenuOptions();
    expect(bringToFrontMenuOption).toBeEnabled();
    await user.click(bringToFrontMenuOption);
    expect(queryContextMenu()).not.toBeInTheDocument();
  });

  test('user CAN send selected widgets to back', async () => {
    const { sendToBackMenuOption } = getMenuOptions();
    expect(sendToBackMenuOption).toBeEnabled();
    await user.click(sendToBackMenuOption);
    expect(queryContextMenu()).not.toBeInTheDocument();
  });
});

describe('user HAS copied widgets', () => {
  beforeEach(async () => {
    render(<ContextMenu />, {
      preloadedState: [stateWithVisibleContextMenu, stateWithCopiedWidgets],
    });
  });

  test('user CAN paste copied widgets', async () => {
    const { pasteMenuOption } = getMenuOptions();
    expect(pasteMenuOption).toBeEnabled();
    await user.click(pasteMenuOption);
    expect(queryContextMenu()).not.toBeInTheDocument();
  });
});
