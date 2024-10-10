import * as React from 'react';
import { Provider } from 'react-redux';

import { act, render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import UserEvent from '@testing-library/user-event';

import type { ContextMenuProps } from './index';
import ContextMenu from './index';
import { DefaultDashboardMessages } from '~/messages';
import { DASHBOARD_CONTAINER_ID } from '../grid/getDashboardPosition';
import { configureDashboardStore } from '~/store';

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
  const user = UserEvent.setup();
  await user.click(screen.getByText(option));
};

describe('ContextMenu', () => {
  it('can toggle', async () => {
    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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
    const copyWidgets = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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
    const copyWidgets = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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
    const pasteWidgets = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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

  it('does not paste if there are no copied widgets', async () => {
    const pasteWidgets = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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
    const deleteWidgets = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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

  it('does not delete if there are no selected widgets', async () => {
    const deleteWidgets = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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
    const bringWidgetsToFront = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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

  it('does not bring to front if there are no selected widgets', async () => {
    const bringWidgetsToFront = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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
    const sendWidgetsToBack = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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

  it('does not send to back if there are no selected widgets', async () => {
    const sendWidgetsToBack = jest.fn();

    const args: ContextMenuProps = {
      messageOverrides: DefaultDashboardMessages,
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
