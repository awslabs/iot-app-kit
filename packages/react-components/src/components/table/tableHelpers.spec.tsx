import React from 'react';
import { render } from '@testing-library/react';
import { getDefaultColumnDefinitions } from './tableHelpers';
import type { TableColumnDefinition, TableItemHydrated } from './types';

describe('getDefaultColumnDefinitions', () => {
  it('returns valid Polaris table columnDefinitions', () => {
    const userColumnDefinitions: TableColumnDefinition[] = [
      {
        key: 'key1',
        header: 'Header',
      },
    ];

    const columnDefs = getDefaultColumnDefinitions(userColumnDefinitions);
    expect(columnDefs[0]).toMatchObject({
      cell: expect.toBeFunction(),
      header: 'Header',
    });
  });
});

describe('default cell function', () => {
  const userColumnDefinitions: TableColumnDefinition[] = [
    {
      key: 'data',
      header: 'Data',
    },
    {
      key: 'notExist',
      header: 'Not Exist',
    },
  ];
  const [firstColumnDef, secondColumnDef] = getDefaultColumnDefinitions(
    userColumnDefinitions
  );

  it("returns item's value", () => {
    const item: TableItemHydrated = {
      data: {
        value: 10,
        error: undefined,
        isLoading: undefined,
        valueOf: jest.fn(),
      },
    };
    const { container } = render(<div>{firstColumnDef.cell(item)}</div>);

    expect(container.textContent).toContain('10');
  });

  it('does not return quality text for good value', () => {
    const item: TableItemHydrated = {
      data: {
        value: 10,
        error: undefined,
        isLoading: undefined,
        valueOf: jest.fn(),
        quality: 'GOOD',
      },
    };
    const { container } = render(<div>{firstColumnDef.cell(item)}</div>);
    expect(container.textContent).not.toContain('Quality');
  });

  it('returns uncertain quality text for uncertain value', () => {
    const item: TableItemHydrated = {
      data: {
        value: 10,
        error: undefined,
        isLoading: undefined,
        valueOf: jest.fn(),
        quality: 'UNCERTAIN',
      },
    };
    const { container } = render(<div>{firstColumnDef.cell(item)}</div>);
    expect(container.textContent).toContain('Uncertain Quality');
  });

  it('returns bad quality text for bad value', () => {
    const item: TableItemHydrated = {
      data: {
        value: 10,
        error: undefined,
        isLoading: undefined,
        valueOf: jest.fn(),
        quality: 'BAD',
      },
    };
    const { container } = render(<div>{firstColumnDef.cell(item)}</div>);
    expect(container.textContent).toContain('Bad Quality');
  });

  it('return hyphen when property not found in tableItem', () => {
    const item: TableItemHydrated = {
      data: {
        value: 10,
        error: undefined,
        isLoading: undefined,
        valueOf: jest.fn(),
      },
    };
    const { container } = render(<div>{secondColumnDef.cell(item)}</div>);
    expect(container.textContent).toEqual('-');
  });

  it('returns error message when in error state', () => {
    const item: TableItemHydrated = {
      data: {
        value: 10,
        error: {
          msg: 'Some Error',
        },
        isLoading: undefined,
        valueOf: jest.fn(),
      },
    };
    const { container } = render(<div>{firstColumnDef.cell(item)}</div>);
    expect(container.textContent).toContain('Some Error');
  });

  it('returns loading svg when in error state', () => {
    const item: TableItemHydrated = {
      data: {
        value: 10,
        error: undefined,
        isLoading: true,
        valueOf: jest.fn(),
      },
    };

    const { container } = render(<div>{firstColumnDef.cell(item)}</div>);
    const svgElement = container.getElementsByTagName('svg');
    expect(svgElement.item(0)!.getAttribute('data-testid')).toEqual('loading');
  });
});
