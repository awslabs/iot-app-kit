import { DateRangePickerProps } from '@cloudscape-design/components';
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

export type ViewportMessages = DateRangePickerProps.I18nStrings & {
  title: string;
  placeholder: string;
  dateRangeIncompleteError: string;
  dateRangeInvalidError: string;
};

export type DashboardMessages = {
  toolbar: ToolbarMessages;
  widgets: WidgetsMessages;
  contextMenu: ContextMenuMessages;
  viewport: ViewportMessages;
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
  viewport: {
    title: 'Time Machine',
    placeholder: 'Dashboard time range',
    todayAriaLabel: 'Today',
    nextMonthAriaLabel: 'Next month',
    previousMonthAriaLabel: 'Previous month',
    customRelativeRangeDurationLabel: 'Duration',
    customRelativeRangeDurationPlaceholder: 'Enter duration',
    customRelativeRangeOptionLabel: 'Custom range',
    customRelativeRangeOptionDescription: 'Set a custom range in the past',
    customRelativeRangeUnitLabel: 'Unit of time',
    dateTimeConstraintText: 'For date, use YYYY/MM/DD. For time, use 24 hr format.',
    relativeModeTitle: 'Relative range',
    absoluteModeTitle: 'Absolute range',
    relativeRangeSelectionHeading: 'Choose a range',
    startDateLabel: 'Start date',
    endDateLabel: 'End date',
    startTimeLabel: 'Start time',
    endTimeLabel: 'End time',
    clearButtonLabel: 'Clear and dismiss',
    cancelButtonLabel: 'Cancel',
    applyButtonLabel: 'Apply',
    formatRelativeRange: (e) => {
      if (e.amount === 1) return `Last ${e.unit}`;
      return `Last ${e.amount} ${e.unit}s`;
    },
    formatUnit: (e, n) => (1 === n ? e : `${e}s`),
    dateRangeIncompleteError: 'The selected date range is incomplete. Select a start and end date for the date range.',
    dateRangeInvalidError: 'The selected date range is invalid. The start date must be before the end date.',
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
