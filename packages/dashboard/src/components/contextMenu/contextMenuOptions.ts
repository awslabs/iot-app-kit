import { isMacLike } from '~/util/browser';

const mod = isMacLike ? '⌘' : 'Ctrl';
export const keyboardShortcuts = {
  mod,
  copy: `${mod}C`,
  paste: `${mod}V`,
  bringToFront: ']',
  sendToBack: '[',
};

interface ContextMenuOptionConfiguration {
  id: string;
  action: VoidFunction;
  text: string;
  disabled: boolean;
  hotkey?: string;
}

interface ContextMenuSectionConfiguration {
  id: string;
  options: ContextMenuOptionConfiguration[];
}

export type ContextMenuConfiguration = ContextMenuSectionConfiguration[];

export interface ContextMenuConfigurationProps {
  actions: {
    copyAction: VoidFunction;
    pasteAction: VoidFunction;
    deleteAction: VoidFunction;
    bringToFrontAction: VoidFunction;
    sendToBackAction: VoidFunction;
  };
  state: {
    hasSelectedWidgets: boolean;
    hasCopiedWidgets: boolean;
  };
}

type OptionCreator = (
  props: ContextMenuConfigurationProps
) => ContextMenuOptionConfiguration;

interface ContextMenuConfigurationCreator {
  id: string;
  options: OptionCreator[];
}

const createCopyOption: OptionCreator = (
  props: ContextMenuConfigurationProps
): ContextMenuOptionConfiguration => {
  const { actions, state } = props;
  return {
    id: 'copy',
    text: 'Copy',
    hotkey: keyboardShortcuts.copy,
    disabled: !state.hasSelectedWidgets,
    action: actions.copyAction,
  };
};

const createPasteOption: OptionCreator = (
  props: ContextMenuConfigurationProps
): ContextMenuOptionConfiguration => {
  const { actions, state } = props;
  return {
    id: 'paste',
    text: 'Paste',
    hotkey: keyboardShortcuts.paste,
    disabled: !state.hasCopiedWidgets,
    action: actions.pasteAction,
  };
};

const createDeleteOption: OptionCreator = (
  props: ContextMenuConfigurationProps
): ContextMenuOptionConfiguration => {
  const { actions, state } = props;
  return {
    id: 'delete',
    text: 'Delete',
    disabled: !state.hasSelectedWidgets,
    action: actions.deleteAction,
  };
};

const createBringToFrontOption: OptionCreator = (
  props: ContextMenuConfigurationProps
): ContextMenuOptionConfiguration => {
  const { actions, state } = props;
  return {
    id: 'bringToFront',
    text: 'Bring to front',
    hotkey: keyboardShortcuts.bringToFront,
    disabled: !state.hasSelectedWidgets,
    action: actions.bringToFrontAction,
  };
};

const createSendToBackOption: OptionCreator = (
  props: ContextMenuConfigurationProps
): ContextMenuOptionConfiguration => {
  const { actions, state } = props;
  return {
    id: 'sendToBack',
    text: 'Send to back',
    hotkey: keyboardShortcuts.sendToBack,
    disabled: !state.hasSelectedWidgets,
    action: actions.sendToBackAction,
  };
};

const configuration: ContextMenuConfigurationCreator[] = [
  {
    id: 'section1',
    options: [createCopyOption, createPasteOption, createDeleteOption],
  },
  {
    id: 'section2',
    options: [createBringToFrontOption, createSendToBackOption],
  },
];

export const createContextMenuOptions = (
  props: ContextMenuConfigurationProps
): ContextMenuConfiguration =>
  configuration.map((section) => ({
    ...section,
    options: section.options.map((createOption) => createOption(props)),
  }));
