import { createCellItem } from './createCellItem';
import { CellItem } from './types';

describe('createCellItem', () => {
  it('creates CellItem', () => {
    const props = { value: 10, error: undefined, isLoading: false, threshold: undefined };
    const item: CellItem = createCellItem(props);
    expect(item).toMatchObject({ value: 10 });
    expect(item.valueOf()).toEqual(10);
  });

  it('creates CellItem that returns error message on error', () => {
    const props = { value: 10, error: { msg: 'Some error' }, isLoading: false, threshold: undefined };
    const item: CellItem = createCellItem(props);

    expect(`${item}`).toBe('Some error');
  });

  it('creates CellItem that returns loading message on loading', () => {
    const props = { value: 10, isLoading: true, threshold: undefined };
    const item: CellItem = createCellItem(props);

    expect(`${item}`).toBe('Loading');
  });
});
