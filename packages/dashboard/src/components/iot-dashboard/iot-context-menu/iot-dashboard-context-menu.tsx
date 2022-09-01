import { Component, Prop, h, State } from '@stencil/core';
import { CustomEvent } from '../../../decorators/events';
import { DashboardMessages } from '../../../messages';
import { MouseClick, Position } from '../../../types';
import { getDashboardPosition } from '../getDashboardPosition';
import { ContextMenuConfiguration, createContextMenuOptions } from './contextMenuOptions';

type ActionsProp = {
  onCopy: () => void;
  onPaste: (position?: Position) => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
};

@Component({
  tag: 'iot-dashboard-context-menu',
  shadow: false,
})
export class IotDashboardContextMenu {
  /** Message overrides to be used in the dashboard. */
  @Prop() messageOverrides: DashboardMessages;

  /** Actions to use for context menu */
  @Prop() actions: ActionsProp;

  /** Widget selections to be used to determine enabled actions. */
  @Prop() hasSelectedWidgets: boolean;
  @Prop() hasCopiedWidgets: boolean;

  /** State to keep track of the context menu popover visibility and position. */
  @State() contextMenuOpen = false;
  @State() contextMenuPosition: Position | undefined;

  private contextMenuTarget: HTMLElement | null;

  @CustomEvent('press', { target: 'parent', trigger: 'touch' })
  onPress(event: TouchEvent) {
    this.onContextMenu(event);
  }

  componentWillLoad() {
    this.contextMenuTarget = document.querySelector('iot-dashboard-context-menu')?.parentElement ?? null;

    if (this.contextMenuTarget) {
      this.contextMenuTarget.addEventListener('contextmenu', this.preventNativeContextMenu.bind(this));
      this.contextMenuTarget.addEventListener('mousedown', this.onMouseDown.bind(this));
    }
  }

  disconnectedCallback() {
    if (this.contextMenuTarget) {
      this.contextMenuTarget.removeEventListener('contextmenu', this.preventNativeContextMenu.bind(this));
      this.contextMenuTarget.removeEventListener('mousedown', this.onMouseDown.bind(this));
    }
  }

  preventNativeContextMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  onContextMenu(event: MouseEvent | TouchEvent | PointerEvent) {
    const { x, y } = getDashboardPosition(event);
    this.contextMenuOpen = !this.contextMenuOpen;
    this.contextMenuPosition = { x, y };
    event.preventDefault();
    return;
  }

  onMouseDown(event: MouseEvent) {
    const isContextMenuGesture = event.button === MouseClick.Right;

    /**
     * prevent mousedown events on the context menu from closing the menu
     * before the onClick handler can be called
     */
    const isAgainstContextMenuTarget =
      event.target &&
      (event.target as HTMLElement).matches &&
      (event.target as HTMLElement).matches('.iot-context-menu-option, .iot-context-menu-section');

    if (isContextMenuGesture) {
      this.onContextMenu(event);
    } else if (!isContextMenuGesture && this.contextMenuOpen && !isAgainstContextMenuTarget) {
      this.hideContextMenu();
    }
  }

  hideContextMenu() {
    this.contextMenuOpen = false;
    this.contextMenuPosition = undefined;
  }

  getContextMenuConfiguration = (): ContextMenuConfiguration => {
    const withClose = (action: (event: MouseEvent) => void) => (event: MouseEvent) => {
      action(event);
      this.hideContextMenu();
    };

    const { onCopy, onPaste, onDelete, onBringToFront, onSendToBack } = this.actions;

    const copyAction = withClose(() => onCopy());
    const pasteAction = withClose(() => onPaste(this.contextMenuPosition));
    const deleteAction = withClose(() => onDelete());
    const bringToFrontAction = withClose(() => onBringToFront());
    const sendToBackAction = withClose(() => onSendToBack());

    return createContextMenuOptions({
      messages: this.messageOverrides.contextMenu,
      actions: {
        copyAction,
        pasteAction,
        deleteAction,
        bringToFrontAction,
        sendToBackAction,
      },
      state: {
        hasCopiedWidgets: this.hasCopiedWidgets,
        hasSelectedWidgets: this.hasSelectedWidgets,
      },
    });
  };

  render() {
    if (this.contextMenuOpen && this.contextMenuPosition) {
      return (
        <iot-context-menu {...this.contextMenuPosition}>
          {this.getContextMenuConfiguration().map(({ id: sectionId, options }) => (
            <iot-context-menu-section key={sectionId}>
              {options.map(({ id: optionId, text, hotkey, action, disabled }) => (
                <iot-context-menu-option key={optionId} onClick={action} disabled={disabled}>
                  {text}
                  {hotkey && <span slot="hotkey">{hotkey}</span>}
                </iot-context-menu-option>
              ))}
            </iot-context-menu-section>
          ))}
        </iot-context-menu>
      );
    }
    return null;
  }
}
