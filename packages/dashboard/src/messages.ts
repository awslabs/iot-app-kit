import { isMacLike } from './util/browser';

export type ContextMenuMessages = {
  copyText: string;
  pasteText: string;
  deleteText: string;
  bringToFrontText: string;
  sendToBackText: string;
};

export type TextWidgetMessages = {
  placeholder: string;
  editAction: string;
  removeAction: string;
  editTextLabel: string;
  editLinkLabel: string;
};

export type WidgetsMessages = {
  invalidTagHeader: string;
  invalidTagSubheader: string;
  text: TextWidgetMessages;
};

export type ToolbarMessages = {
  componentLibrary: string;
};

export type DashboardMessages = {
  toolbar: ToolbarMessages;
  widgets: WidgetsMessages;
  contextMenu: ContextMenuMessages;
};

export const DefaultDashboardMessages: DashboardMessages = {
  toolbar: {
    componentLibrary: 'Component Library',
  },
  widgets: {
    invalidTagHeader: 'Widget failed to load',
    invalidTagSubheader: 'Please try again later or contact an admin for help.',
    text: {
      placeholder: 'Add text',
      editAction: 'Edit',
      removeAction: 'Remove',
      editTextLabel: 'Text',
      editLinkLabel: 'Link',
    },
  },
  contextMenu: {
    copyText: 'Copy',
    pasteText: 'Paste',
    deleteText: 'Delete',
    bringToFrontText: 'Bring to Front',
    sendToBackText: 'Send to Back',
  },
};

const mod = isMacLike ? '⌘' : 'Ctrl';
export const keyboardShortcuts = {
  mod,
  copy: `${mod}C`,
  paste: `${mod}V`,
  bringToFront: ']',
  sendToBack: '[',
};
