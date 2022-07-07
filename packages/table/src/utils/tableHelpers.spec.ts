import { ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, Root } from 'react-dom/client';
import { getDefaultColumnDefinitions } from './tableHelpers';
import { ColumnDefinition, TableItem } from './types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('getDefaultColumnDefinitions', () => {
  it('returns valid Polaris table columnDefinitions', () => {
    const userColumnDefinitions: ColumnDefinition[] = [
      {
        key: 'key1',
        header: 'Header',
      },
    ];

    const columnDefs = getDefaultColumnDefinitions(userColumnDefinitions);
    expect(columnDefs[0]).toMatchObject({ cell: expect.toBeFunction(), header: 'Header' });
  });
});

describe('default cell function', () => {
  let root: Root;
  const container = document.createElement('div');
  document.body.appendChild(container);

  beforeEach(() => {
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
  });

  const userColumnDefinitions: ColumnDefinition[] = [
    {
      key: 'data',
      header: 'Data',
    },
    {
      key: 'notExist',
      header: 'Not Exist',
    },
  ];
  const [firstColumnDef, secondColumnDef] = getDefaultColumnDefinitions(userColumnDefinitions);

  it("returns item's value", () => {
    const item: TableItem = {
      data: {
        value: 10,
        error: undefined,
        isLoading: undefined,
        valueOf: jest.fn(),
      },
    };
    const cell = firstColumnDef.cell(item) as ReactElement<HTMLSpanElement>;
    act(() => {
      root.render(cell);
    });

    expect(container.textContent).toContain('10');
  });

  it('return hyphen when property not found in tableItem', () => {
    const item: TableItem = {
      data: {
        value: 10,
        error: undefined,
        isLoading: undefined,
        valueOf: jest.fn(),
      },
    };
    const cell = secondColumnDef.cell(item) as ReactElement<HTMLSpanElement>;
    act(() => {
      root.render(cell);
    });

    expect(container.textContent).toEqual('-');
  });

  it('returns error message when in error state', () => {
    const item: TableItem = {
      data: {
        value: 10,
        error: {
          msg: 'Some Error',
        },
        isLoading: undefined,
        valueOf: jest.fn(),
      },
    };
    const cell = firstColumnDef.cell(item) as ReactElement<HTMLSpanElement>;
    act(() => {
      root.render(cell);
    });

    expect(container.textContent).toContain('Some Error');
  });

  it('returns loading svg when in error state', () => {
    const item: TableItem = {
      data: {
        value: 10,
        error: undefined,
        isLoading: true,
        valueOf: jest.fn(),
      },
    };

    const cell = firstColumnDef.cell(item) as ReactElement;
    act(() => {
      root.render(cell);
    });

    const svgElement = container.getElementsByTagName('svg');
    expect(svgElement.item(0)?.getAttribute('data-testid')).toEqual('loading');
  });
});
