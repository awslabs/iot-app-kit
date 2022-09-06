import wrapper from '@awsui/components-react/test-utils/selectors';

export const getTableRowSelector = (index: number, selector?: string) =>
  wrapper().findTable(selector).findRows().get(index).toSelector();

export const getTableRowsSelector = (selector?: string) => wrapper().findTable(selector).findRows().toSelector();

export const getTableCellSelector = (rowIndex: number, columnIndex: number, selector?: string) =>
  wrapper().findTable(selector).findBodyCell(rowIndex, columnIndex).toSelector();

export const getTableDescSortedColumnSelector = (selector?: string) =>
  wrapper().findTable(selector).findDescSortedColumn().toSelector();

export const getTableAscSortedColumnSelector = (selector?: string) =>
  wrapper().findTable(selector).findAscSortedColumn().toSelector();

export const setTableColumnSelectionSelector = (selector?: string, columnIndex = 1, forceClick = false) => {
  cy.get(
    wrapper()
      .findTable(selector)
      .findColumnSortingArea(columnIndex + 1)
      .toSelector()
  ).click({ force: forceClick, multiple: true });
};

export const getTextFilterSelector = (selector?: string) => wrapper().findTextFilter(selector).toSelector();

export const setTextFilterValue = (value: string, selector: string) =>
  cy.get(selector).focus().clear().type(value, { delay: 100 });

export const clearInputValue = (selector: string) => cy.get(selector).focus().clear();

export const setTableRowSelection = (rowIndex: number, selector?: string) => {
  cy.get(wrapper().findTable(selector).findRowSelectionArea(rowIndex).toSelector()).click();
};

export const getTableSelectedRowsSelector = (selector?: string) =>
  wrapper().findTable(selector).findSelectedRows().toSelector();
