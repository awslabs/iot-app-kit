import { type Locator, type Page } from '@playwright/test';

import { type DragPosition, dragAndDrop } from './dragAndDrop';
import { center } from './mousePosition';
import { type BoundingBox, getBoundingBox } from './locator';

export const GRID_SIZE = 10;

const WidgetSelector = '[data-gesture=widget]';
const SelectionSelector = '[data-gesture=selection]';
const GridSelector = '#container';

const WidgetSelectorMap = {
  kpi: 'add KPI widget',
  text: 'add Text widget',
  line: 'add Line widget',
};

const SelectionAnchorMap = {
  'bottom-right': '[data-anchor=bottom-right]',
};

export const gridUtil = (page: Page) => {
  const dragGenerator = dragAndDrop(page);

  const gridArea = page.locator(GridSelector);

  return {
    /**
     * @param col - column of grid to select
     * @param row - row of grid to select
     * @returns the real x, y postion in the viewport of that cell
     */
    cellLocation: async (col: number, row: number) => {
      const { x, y, width } = await getBoundingBox(gridArea);
      const cellSize = width / GRID_SIZE;
      const gutter = cellSize / 2;
      return {
        x: x + (col * cellSize + gutter),
        y: y + (row * cellSize + gutter),
      };
    },
    /**
     *
     * @returns all of the widget Locators in the grid
     */
    widgets: async (): Promise<Locator[]> =>
      await page.locator(WidgetSelector).all(),
    /**
     * @param widgetType - which widget to drag and drop from the component pallette
     * @param offset - position offset from the top left corner of grid
     * @returns the locator of the added widget
     */
    addWidget: async (
      widgetType: keyof typeof WidgetSelectorMap,
      offset?: (gridBounds: BoundingBox) => { x: number; y: number }
    ): Promise<Locator> => {
      const defaultGridTargetOffset = ({ x, y }: BoundingBox) => ({ x, y }); // Default is 0, 0 on the grid
      const gridTargetOffset = offset || defaultGridTargetOffset;
      const widget = page.getByRole('button', {
        name: WidgetSelectorMap[widgetType],
      });
      const draggableWidget = dragGenerator(widget);
      await draggableWidget.dragTo(gridArea, {
        targetPosition: ({ target }) => gridTargetOffset(target),
      });
      const widgets = await page.locator(WidgetSelector).all();
      // Assumption that the widget added is last in the DOM
      const addedWidget = widgets.at(-1);
      if (!addedWidget) throw new Error('No added widget');
      return addedWidget;
    },
    /**
     * click the upper right corner of the grid to click out of the selection
     */
    clearSelection: async () => {
      const bounds = await getBoundingBox(gridArea);
      const { x, y, width } = bounds;
      await page.mouse.move(x + width - 10, y + 10);
      await page.mouse.down({ button: 'left' });
      await page.mouse.up({ button: 'left' });
    },
    /**
     * @param widgetLocator - click the center of the locator
     */
    clickWidget: async (widgetLocator: Locator) => {
      const bounds = await getBoundingBox(widgetLocator);
      await page.mouse.move(...center(bounds));
      await page.mouse.down({ button: 'left' });
      await page.mouse.up({ button: 'left' });
    },
    /**
     * drag select from the top left to the bottom right of the grid
     */
    selectAll: async () => {
      await dragGenerator(gridArea).dragTo(gridArea, {
        sourcePosition: ({ source }) => ({ x: source.x, y: source.y }),
        targetPosition: ({ target }) => ({
          x: target.x + target.width,
          y: target.y + target.height,
        }),
      });
    },
    /**
     * @param anchor - anchor of the selection box to click drag
     * @param targetPosition - the position offset to move the anchor to
     */
    resizeSelection: async (
      anchor: keyof typeof SelectionAnchorMap,
      targetPosition: DragPosition
    ) => {
      const anchorLocator = page.locator(SelectionAnchorMap[anchor]);
      await dragGenerator(anchorLocator).dragTo(gridArea, {
        targetPosition,
      });
    },
    /**
     * drag and drop the selection box from the center to another position
     *
     * @param targetPosition - the position offset of the selection to move to
     */
    moveSelection: async (targetPosition: DragPosition) => {
      const selectionLocator = page.locator(SelectionSelector);
      await dragGenerator(selectionLocator).dragTo(gridArea, {
        targetPosition,
      });
    },
    /**
     * helper to get the user selection box.
     *
     * @returns the user selection box.
     */
    selection: (): Locator => page.locator(SelectionSelector),
    /**
     * helper to get the grid area.
     *
     * @returns the grid area locator.
     */
    gridArea: (): Locator => gridArea,
  };
};
