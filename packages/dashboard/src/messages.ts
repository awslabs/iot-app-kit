import { isMacLike } from './util/browser';
import type { DateRangePickerProps } from '@cloudscape-design/components';

export type ResourceExplorerMessages = {
  explorerEmptyLabel: string;
  panelEmptyLabel: string;
  rootAssetsHeader: string;
  childAssetsHeader: string;
  assetPropertiesHeader: string;
  alarmsHeader: string;
  searchQueryHeader: string;
  searchAriaLabel: string;
  searchPlaceholder: string;
  searchEmpty: string;
};

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

export type InputWidgetMessages = {
  submitLabel: string;
};

export type WidgetsMessages = {
  invalidTagHeader: string;
  invalidTagSubheader: string;
  text: TextWidgetMessages;
  input: InputWidgetMessages;
};

export type ToolbarMessages = {
  componentLibrary: {
    title: string;
    widgets: {
      line: string;
      scatter: string;
      bar: string;
      timeline: string;
      kpi: string;
      status: string;
      table: string;
      text: string;
      input: string;
    };
  };
  actions: {
    title: string;
    save: string;
  };
};

export type ViewportMessages = DateRangePickerProps.I18nStrings & {
  title: string;
  placeholder: string;
  dateRangeIncompleteError: string;
  dateRangeInvalidError: string;
};
export type PropertyComponentMessages = {
  dataType: string;
  unit: string;
};

export type PropertySectionMessages = {
  propertyComponent: PropertyComponentMessages;
};

export type ChartSettingSectionMessages = {
  header: string;
  yAxis: {
    label: string;
    viewOnChart: string;
    title: string;
  };

  legend: {
    title: string;
    width: string;
    position: string;
    showDataColor: string;
  };
};

export type SidePanelMessages = {
  defaultMessage: string;
  header: string;
  propertySection: PropertySectionMessages;

  axisMessages: {
    header: string;
    toggleXLabel: string;
    toggleYLabel: string;
    yLabelContent: string;
  };
  baseSettings: {
    width: string;
    height: string;
    x: string;
    y: string;
    title: string;
  };

  textSettings: {
    title: string;
    font: string;
    color: string;
    style: string;
    size: string;
    horizontal: string;
    vertical: string;
  };

  linkSettings: {
    title: string;
    toggle: string;
    url: string;
  };

  thresholdSettings: {
    if: string;
    colorDataToggle: string;
    title: string;
    containsLabel: string;
    thresholdPlaceHolder: string;
  };

  inputSettings: {
    title: string;
    addOptionLabel: string;
    optionPlaceholder: string;
  };
};

export type DashboardMessages = {
  toolbar: ToolbarMessages;
  widgets: WidgetsMessages;
  contextMenu: ContextMenuMessages;
  viewport: ViewportMessages;
  resourceExplorer: ResourceExplorerMessages;
  sidePanel: SidePanelMessages;
};

export const DefaultDashboardMessages: DashboardMessages = {
  toolbar: {
    componentLibrary: {
      title: 'Component Library',
      widgets: {
        line: 'Line',
        scatter: 'Scatter',
        timeline: 'Timeline',
        bar: 'Bar',
        kpi: 'Kpi',
        status: 'Status',
        table: 'Table',
        text: 'Text',
        input: 'Input',
      },
    },
    actions: {
      title: 'Actions',
      save: 'Save',
    },
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
    input: {
      submitLabel: 'Send',
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
    title: 'Time machine',
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
  resourceExplorer: {
    explorerEmptyLabel: 'No resources found. Please provide an asset tree query from source-iotsitewise.',
    panelEmptyLabel: 'Asset has no properties or child assets.',
    rootAssetsHeader: 'Root Assets',
    childAssetsHeader: 'Child Assets',
    assetPropertiesHeader: 'Asset Properties',
    alarmsHeader: 'Alarms',
    searchQueryHeader: 'Search Query',
    searchAriaLabel: 'Search assets, properties, and alarms',
    searchPlaceholder: 'Enter search term',
    searchEmpty: 'No matches found',
  },
  sidePanel: {
    defaultMessage: 'Select one widget to configure',
    header: 'Configuration',
    propertySection: {
      propertyComponent: {
        dataType: 'Data Type',
        unit: 'Unit',
      },
    },
    axisMessages: {
      header: 'Axis',
      yLabelContent: 'Y axis Label',
      toggleXLabel: 'View X axis',
      toggleYLabel: 'View Y axis',
    },
    baseSettings: {
      x: 'X',
      y: 'Y',
      width: 'Width',
      height: 'Height',
      title: 'Size and position',
    },
    textSettings: {
      title: 'Text',
      font: 'Font',
      color: 'Color',
      style: 'Style',
      size: 'Size',
      horizontal: 'Horizontal',
      vertical: 'Vertical',
    },
    linkSettings: {
      title: 'Link',
      toggle: 'Create link',
      url: 'URL',
    },
    thresholdSettings: {
      if: 'if',
      colorDataToggle: 'Apply threshold color across all data',
      title: 'Threshold',
      containsLabel: 'Contains',
      thresholdPlaceHolder: 'Threshold value',
    },
    inputSettings: {
      title: 'Input',
      addOptionLabel: 'Add',
      optionPlaceholder: 'Add option',
    },
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
