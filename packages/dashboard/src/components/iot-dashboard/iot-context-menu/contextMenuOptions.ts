import { ContextMenuMessages, keyboardShortcuts } from '../../../messages';

type ContextMenuOptionConfiguration = {
  id: string;
  action: (event: MouseEvent) => void;
  text: string;
  disabled: boolean;
  hotkey?: string;
};

type ContextMenuSectionConfiguration = {
  id: string;
  options: ContextMenuOptionConfiguration[];
};

export type ContextMenuConfiguration = ContextMenuSectionConfiguration[];

export type ContextMenuConfigurationProps = {
  messages: ContextMenuMessages;
  actions: {
    copyAction: (event: MouseEvent) => void;
    pasteAction: (event: MouseEvent) => void;
    deleteAction: (event: MouseEvent) => void;
    bringToFrontAction: (event: MouseEvent) => void;
    sendToBackAction: (event: MouseEvent) => void;
  };
  state: {
    hasSelectedWidgets: boolean;
    hasCopiedWidgets: boolean;
  };
};

type OptionCreator = (props: ContextMenuConfigurationProps) => ContextMenuOptionConfiguration;

type ContextMenuConfigurationCreator = {
  id: string;
  options: OptionCreator[];
};

const createCopyOption: OptionCreator = (props: ContextMenuConfigurationProps): ContextMenuOptionConfiguration => {
  const { actions, messages, state } = props;
  return {
    id: 'copy',
    text: messages.copyText,
    hotkey: keyboardShortcuts.copy,
    disabled: !state.hasSelectedWidgets,
    action: actions.copyAction,
  };
};

const createPasteOption: OptionCreator = (props: ContextMenuConfigurationProps): ContextMenuOptionConfiguration => {
  const { actions, messages, state } = props;
  return {
    id: 'paste',
    text: messages.pasteText,
    hotkey: keyboardShortcuts.paste,
    disabled: !state.hasCopiedWidgets,
    action: actions.pasteAction,
  };
};

const createDeleteOption: OptionCreator = (props: ContextMenuConfigurationProps): ContextMenuOptionConfiguration => {
  const { actions, messages, state } = props;
  return {
    id: 'delete',
    text: messages.deleteText,
    disabled: !state.hasSelectedWidgets,
    action: actions.deleteAction,
  };
};

const createBringToFrontOption: OptionCreator = (
  props: ContextMenuConfigurationProps
): ContextMenuOptionConfiguration => {
  const { actions, messages, state } = props;
  return {
    id: 'bringToFront',
    text: messages.bringToFrontText,
    hotkey: keyboardShortcuts.bringToFront,
    disabled: !state.hasSelectedWidgets,
    action: actions.bringToFrontAction,
  };
};

const createSendToBackOption: OptionCreator = (
  props: ContextMenuConfigurationProps
): ContextMenuOptionConfiguration => {
  const { actions, messages, state } = props;
  return {
    id: 'sendToBack',
    text: messages.sendToBackText,
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

export const createContextMenuOptions = (props: ContextMenuConfigurationProps): ContextMenuConfiguration =>
  configuration.map((section) => ({
    ...section,
    options: section.options.map((createOption) => createOption(props)),
  }));
