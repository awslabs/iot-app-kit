import { act, renderHook } from '@testing-library/react-hooks';
import { useTreeCollection } from './useTreeCollection';

const items = [
  {
    id: 'ae65323e-6778-420b-ac1a-eff7a8950300',
    name: 'Item 1',
  },
  {
    id: '7e38bf23-a2e1-4fa7-8ba8-1232313213',
    parentId: 'ae65323e-6778-420b-ac1a-eff7a8950300',
    name: 'Item 1.1',
  },
  {
    id: '7e38bf23-a2e1-4fa7-8ba8-111111',
    parentId: '7e38bf23-a2e1-4fa7-8ba8-1232313213',
    name: 'Item 1.1.1',
  },
];

const columnDefinitions = [
  {
    sortingField: 'name',
    id: 'name',
    header: 'Name',
    cell: (item: any) => item.name,
  },
];

describe('useTreeCollection', () => {
  it('renders hook', () => {
    const { rerender, result } = renderHook(() =>
      useTreeCollection(items, {
        columnDefinitions,
        keyPropertyName: 'id',
        parentKeyPropertyName: 'parentId',
        sorting: {},
        selection: {
          trackBy: 'entityId',
        },
      })
    );

    rerender();

    expect(result.current.items[0].getParent()).not.toBeDefined();
  });
  it('expand nodes', () => {
    const { result } = renderHook(() =>
      useTreeCollection(items, {
        columnDefinitions,
        keyPropertyName: 'id',
        parentKeyPropertyName: 'parentId',
        sorting: {},
        selection: {
          trackBy: 'entityId',
        },
      })
    );

    act(() => {
      result.current.expandNode(result.current.items[0]);
    });

    expect(result.current.items[0].isExpanded()).toEqual(true);
  });
  it('reset nodes', () => {
    const { result } = renderHook(() =>
      useTreeCollection(items, {
        columnDefinitions,
        keyPropertyName: 'id',
        parentKeyPropertyName: 'parentId',
        sorting: {},
        selection: {
          trackBy: 'entityId',
        },
      })
    );

    act(() => {
      result.current.expandNode(result.current.items[0]);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.items[0].isExpanded()).toEqual(false);
  });
  it('should expand all nodes', () => {
    const { result } = renderHook(() =>
      useTreeCollection(
        items,
        {
          columnDefinitions,
          keyPropertyName: 'id',
          parentKeyPropertyName: 'parentId',
          sorting: {},
          selection: {
            trackBy: 'entityId',
          },
        },
        true
      )
    );

    expect(result.current.items[0].isExpanded()).toEqual(true);
    expect(result.current.items[1].isExpanded()).toEqual(true);
    expect(result.current.items[2].isExpanded()).toEqual(true);
  });
  it('should not toggle expanded nodes when expanding all nodes', () => {
    const { result, rerender } = renderHook((expanded: boolean) =>
      useTreeCollection(
        items,
        {
          columnDefinitions,
          keyPropertyName: 'id',
          parentKeyPropertyName: 'parentId',
          sorting: {},
          selection: {
            trackBy: 'entityId',
          },
        },
        expanded
      )
    );

    act(() => {
      result.current.expandNode(result.current.items[0]);
    });

    rerender(true);

    expect(result.current.items[0].isExpanded()).toEqual(true);
    expect(result.current.items[1].isExpanded()).toEqual(true);
    expect(result.current.items[2].isExpanded()).toEqual(true);
  });
});
