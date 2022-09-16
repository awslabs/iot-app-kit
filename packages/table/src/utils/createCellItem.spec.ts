import { createCellItem } from './createCellItem';
import { CellItem } from './types';
import { DefaultTableMessages, TableMessages } from './messages';

const messageOverride = { tableCell: { loading: 'Override loading text' } } as TableMessages;

it('creates CellItem', () => {
  const props = { value: 10, error: undefined, isLoading: false, threshold: undefined };
  const item: CellItem = createCellItem(props, DefaultTableMessages);
  expect(item).toMatchObject({ value: 10 });
  expect(item.valueOf()).toEqual(10);
});

it('creates CellItem that returns error message on error', () => {
  const props = { value: 10, error: { msg: 'Some error' }, isLoading: false, threshold: undefined };
  const item: CellItem = createCellItem(props, DefaultTableMessages);

  expect(`${item}`).toBe('Some error');
});

it('creates CellItem that returns loading message on loading', () => {
  const props = { value: 10, isLoading: true, threshold: undefined };
  const item: CellItem = createCellItem(props, DefaultTableMessages);

  expect(`${item}`).toBe('Loading');
});

it('accepts messageOverrides for loading message', () => {
  const props = { value: 10, isLoading: true, threshold: undefined };
  const item: CellItem = createCellItem(props, messageOverride);

  expect(`${item}`).toBe(messageOverride!.tableCell!.loading);
});
