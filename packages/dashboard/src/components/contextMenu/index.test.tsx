import { act, render, screen, waitFor } from '@testing-library/react';
import ue from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { DASHBOARD_CONTAINER_ID } from '../grid/getDashboardPosition';
import { ContextMenu, type ContextMenuProps } from './index';

const user = ue.setup();

const renderContextMenu = async (args: ContextMenuProps, open?: boolean) => {
  const ret: { container: HTMLElement | null } = {
    container: null,
  };

  const { container, findByText } = render(
    <Provider store={configureDashboardStore()}>
      <div
        id={DASHBOARD_CONTAINER_ID}
        style={{ height: '1000px', width: '1000px' }}
      >
        <ContextMenu {...args} />
        <span>Context Menu</span>
      </div>
    </Provider>
  );
  ret.container = container;

  await findByText('Context Menu');

  if (open) {
    act(() => {
      const ev = new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: 10,
        clientY: 10,
      });
      document.getElementById(DASHBOARD_CONTAINER_ID)?.dispatchEvent(ev);
    });

    await waitFor(() =>
      expect(container.querySelector('.iot-context-menu')).toBeTruthy()
    );
  }

  return ret;
};

const clickOption = async (option: string) => {
  await user.click(screen.getByText(option));
};

describe('ContextMenu', () => {
  it('can toggle', async () => {
    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: false,
      copyWidgets: () => {},
      pasteWidgets: () => {},
      deleteWidgets: () => {},
      bringWidgetsToFront: () => {},
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args);
    if (!container) {
      throw new Error('Container not set');
    }
    expect(container.querySelector('.iot-context-menu')).toBeFalsy();

    act(() => {
      const ev = new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: 10,
        clientY: 10,
      });
      document.getElementById(DASHBOARD_CONTAINER_ID)?.dispatchEvent(ev);
    });

    await waitFor(() =>
      expect(container.querySelector('.iot-context-menu')).toBeTruthy()
    );
  });

  it('can copy', async () => {
    const copyWidgets = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: true,
      copyWidgets,
      pasteWidgets: () => {},
      deleteWidgets: () => {},
      bringWidgetsToFront: () => {},
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Copy');

    expect(copyWidgets).toBeCalled();
  });

  it('does not copy if there is no selection', async () => {
    const copyWidgets = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: false,
      copyWidgets,
      pasteWidgets: () => {},
      deleteWidgets: () => {},
      bringWidgetsToFront: () => {},
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Copy');

    expect(copyWidgets).not.toBeCalled();
  });

  it('can paste', async () => {
    const pasteWidgets = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: true,
      hasSelectedWidgets: false,
      copyWidgets: () => {},
      pasteWidgets,
      deleteWidgets: () => {},
      bringWidgetsToFront: () => {},
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Paste');

    expect(pasteWidgets).toBeCalled();
  });

  it('does not paste if there are no copied widget-instance', async () => {
    const pasteWidgets = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: false,
      copyWidgets: () => {},
      pasteWidgets,
      deleteWidgets: () => {},
      bringWidgetsToFront: () => {},
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Paste');

    expect(pasteWidgets).not.toBeCalled();
  });

  it('can delete', async () => {
    const deleteWidgets = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: true,
      copyWidgets: () => {},
      pasteWidgets: () => {},
      deleteWidgets,
      bringWidgetsToFront: () => {},
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Delete');

    expect(deleteWidgets).toBeCalled();
  });

  it('does not delete if there are no selected widget-instance', async () => {
    const deleteWidgets = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: false,
      copyWidgets: () => {},
      pasteWidgets: () => {},
      deleteWidgets,
      bringWidgetsToFront: () => {},
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Delete');

    expect(deleteWidgets).not.toBeCalled();
  });

  it('can bring to front', async () => {
    const bringWidgetsToFront = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: true,
      copyWidgets: () => {},
      pasteWidgets: () => {},
      deleteWidgets: () => {},
      bringWidgetsToFront,
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Bring to Front');

    expect(bringWidgetsToFront).toBeCalled();
  });

  it('does not bring to front if there are no selected widget-instance', async () => {
    const bringWidgetsToFront = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: false,
      copyWidgets: () => {},
      pasteWidgets: () => {},
      deleteWidgets: () => {},
      bringWidgetsToFront,
      sendWidgetsToBack: () => {},
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Bring to Front');

    expect(bringWidgetsToFront).not.toBeCalled();
  });

  it('can send to back', async () => {
    const sendWidgetsToBack = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: true,
      copyWidgets: () => {},
      pasteWidgets: () => {},
      deleteWidgets: () => {},
      bringWidgetsToFront: () => {},
      sendWidgetsToBack,
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Send to Back');

    expect(sendWidgetsToBack).toBeCalled();
  });

  it('does not send to back if there are no selected widget-instance', async () => {
    const sendWidgetsToBack = vi.fn();

    const args: ContextMenuProps = {
      hasCopiedWidgets: false,
      hasSelectedWidgets: false,
      copyWidgets: () => {},
      pasteWidgets: () => {},
      deleteWidgets: () => {},
      bringWidgetsToFront: () => {},
      sendWidgetsToBack,
    };

    const { container } = await renderContextMenu(args, true);
    if (!container) {
      throw new Error('Container not set');
    }

    await clickOption('Send to Back');

    expect(sendWidgetsToBack).not.toBeCalled();
  });
});
