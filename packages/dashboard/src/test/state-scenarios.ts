import { type PreloadedRootState } from '~/store';

export const stateWithHiddenContextMenu = {
  contextMenu: {
    position: undefined,
  },
} satisfies PreloadedRootState;

export const stateWithVisibleContextMenu = {
  contextMenu: {
    position: { x: 0, y: 0 },
  },
} satisfies PreloadedRootState;

export const stateWithWidgets = {
  dashboard: {
    present: {
      dashboardConfiguration: {
        widgets: [{ id: '1' }, { id: '2' }, { id: '3' }],
      },
    },
  },
};

export const stateWithSelectedWidgets = {
  ...stateWithWidgets,
  selection: { selectedWidgetIds: ['1', '2', '3'] },
} satisfies PreloadedRootState;

export const stateWithCopiedWidgets = {
  dashboard: {
    present: {
      copiedWidgetIds: ['1', '2', '3'],
      dashboardConfiguration: {
        widgets: [{ id: '1' }, { id: '2' }, { id: '3' }],
      },
    },
  },
} satisfies PreloadedRootState;

export const stateWithFuture = {
  dashboard: {
    future: [
      { dashboardConfiguration: { widgets: [{ id: '1' }, { id: '2' }] } },
    ],
  },
} satisfies PreloadedRootState;

export const stateWithoutFuture = {
  dashboard: {
    future: [],
  },
} satisfies PreloadedRootState;

export const stateWithPastAndFuture = {
  dashboard: {
    past: [
      {
        dashboardConfiguration: {
          widgets: [{ id: '1' }],
        },
      },
      {
        dashboardConfiguration: {
          widgets: [{ id: '1' }, { id: '2' }],
        },
      },
    ],
    present: {
      dashboardConfiguration: {
        widgets: [{ id: '1' }, { id: '2' }, { id: '3' }],
      },
    },
    future: [
      {
        dashboardConfiguration: {
          widgets: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
        },
      },
    ],
  },
} satisfies PreloadedRootState;

export const stateWithEditMode = {
  mode: 'edit',
} satisfies PreloadedRootState;

export const stateWithViewMode = {
  mode: 'view',
} satisfies PreloadedRootState;
