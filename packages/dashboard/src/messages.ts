import { isMacLike } from './util/browser';

export type ContextMenuMessages = {
  copyText: string;
  pasteText: string;
  deleteText: string;
  bringToFrontText: string;
  sendToBackText: string;
};

export type WidgetsMessages = {
  invalidTagHeader: string;
  invalidTagSubheader: string;
};

export type DashboardMessages = {
  widgets: WidgetsMessages;
  contextMenu: ContextMenuMessages;
};

export const DefaultDashboardMessages: DashboardMessages = {
  widgets: {
    invalidTagHeader: 'Widget failed to load',
    invalidTagSubheader: 'Please try again later or contact an admin for help.',
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
