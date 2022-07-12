import { ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, Root } from 'react-dom/client';
import { PropertyFilteringOption } from '@awsui/collection-hooks/dist/mjs/interfaces';
import { round } from '@iot-app-kit/core';
import { formatPropertyFilterOptions, getDefaultColumnDefinitions } from './tableHelpers';
import { ColumnDefinition, TableItem } from './types';
import { createCellItem } from './createCellItem';

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

  it('return empty when property not found in tableItem', () => {
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

    expect(container.textContent).toBeEmpty();
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

describe('formatPropertyFilterOptions', () => {
  it('returns valid filterOptions', () => {
    const item: TableItem = {
      p1: createCellItem({
        value: 10.12345,
      }),
      p2: createCellItem({ value: 10 }),
      error: createCellItem({
        error: {
          msg: 'Property not found (Property Id = d8937b65-5f03-4e40-93ac-c5513420ade3, Asset Id = 5b054c8e-ad23-4228-8620-826859ddf675)',
        },
      }),
    };

    const propertyFilterOptions: PropertyFilteringOption[] = Object.keys(item).map((key) => ({
      propertyKey: key,
      value: `${item[key].valueOf()}`,
    }));
    const userColumnDefinitions: ColumnDefinition[] = [
      {
        key: 'p1',
        header: 'Property 1',
      },
      {
        key: 'p2',
        header: 'Property 2',
        formatter: (data) => `${data} unit`, // formatter would not work on filter options at this moment.
      },
      {
        key: 'error',
        header: 'Some error value',
      },
      {
        key: 'nonFound',
        header: 'Not found',
      },
    ];
    const colDefs = getDefaultColumnDefinitions(userColumnDefinitions);

    const filterOptions = formatPropertyFilterOptions(propertyFilterOptions, colDefs, [item]);

    expect(filterOptions).toEqual([
      { propertyKey: 'p1', value: `${round(10.12345)}` },
      { propertyKey: 'p2', value: '10' },
      {
        propertyKey: 'error',
        value:
          'Property not found (Property Id = d8937b65-5f03-4e40-93ac-c5513420ade3, Asset Id = 5b054c8e-ad23-4228-8620-826859ddf675)',
      },
    ]);
  });
});
