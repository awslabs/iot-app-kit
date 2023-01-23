import { DateRangePickerProps } from '@cloudscape-design/components';

import { isMacLike } from './util/browser';

export type ResourceExplorerMessages = {
  explorerEmptyLabel: string;
  panelEmptyLabel: string;
  rootAssetsHeader: string;
  childAssetsHeader: string;
  assetPropertiesHeader: string;
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

export type WidgetsMessages = {
  invalidTagHeader: string;
  invalidTagSubheader: string;
  text: TextWidgetMessages;
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
  yAxis: {
    label: string;
    viewOnChart: string;
    title: string;
  };

  legend: {
    width: string;
    position: string;
    showDataColor: string;
  };
};

export type SidePanelMessages = {
  propertySection: PropertySectionMessages;
  chartSettingSection: ChartSettingSectionMessages;
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
  resourceExplorer: {
    explorerEmptyLabel: 'No resources found. Please provide an asset tree query from source-iotsitewise.',
    panelEmptyLabel: 'Asset has no properties or child assets.',
    rootAssetsHeader: 'Root Assets',
    childAssetsHeader: 'Child Assets',
    assetPropertiesHeader: 'Asset Properties',
  },
  sidePanel: {
    propertySection: {
      propertyComponent: {
        dataType: 'Data Type',
        unit: 'Unit',
      },
    },
    chartSettingSection: {
      legend: {
        position: 'Position',
        width: 'Width',
        showDataColor: 'Show datastream color',
      },
      yAxis: {
        label: 'Y-Axis',
        viewOnChart: 'View on chart',
        title: 'Title',
      },
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
      horizontal: 'Horiz',
      vertical: 'Vertical',
    },
    linkSettings: {
      title: 'Link',
      toggle: 'Create link',
      url: 'URL',
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
