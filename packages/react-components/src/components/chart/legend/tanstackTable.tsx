import React, { useState } from 'react';

import {
  spaceStaticXxs,
  colorBorderButtonPrimaryDisabled,
  colorBackgroundButtonNormalDefault,
  spaceStaticM,
  spaceStaticXxxs,
  colorBackgroundLayoutToggleActive,
  spaceStaticXs,
} from '@cloudscape-design/design-tokens';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';

import AscendingIcon from './ascendingIcon.svg';
import DescendingIcon from './descendingIcon.svg';
import SortingIcon from './sortingIcon.svg';
import './tanstackTable.css';

type tanstackTableOptions = {
  data: object[];
  columnDefinitions: ColumnDef<object, string>[];
  stickyColumns?: { first: number };
  stickyHeader?: boolean;
};

export const TanstackTable = ({
  data,
  columnDefinitions,
  stickyColumns,
  stickyHeader,
}: tanstackTableOptions) => {
  const columns: ColumnDef<object, string>[] = [...columnDefinitions];
  const [sorting, setSorting] = useState<SortingState>([]);
  const sortingIcons = {
    padding: `0 ${spaceStaticXs}`,
    height: spaceStaticM,
    width: spaceStaticM,
    strokeWidth: spaceStaticXxxs,
  };

  const legendData = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='tanstack-table-container'>
      <table
        className='tanstack-table'
        style={{ color: colorBackgroundLayoutToggleActive }}
      >
        <thead>
          {legendData.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => (
                <th
                  className={`tanstack-table-header-divider ${
                    stickyHeader && 'tanstack-table-sticky-header'
                  } ${
                    stickyColumns?.first === i + 1 &&
                    'tanstack-table-sticky-column'
                  }`}
                  key={header.id}
                  style={{
                    padding: `${spaceStaticM} ${spaceStaticXxs}`,
                    backgroundColor: `${colorBackgroundButtonNormalDefault}`,
                    borderBottom: `1px solid ${colorBorderButtonPrimaryDisabled}`,
                  }}
                  onClick={() => {
                    header.column.getCanSort() && header.column.toggleSorting();
                  }}
                >
                  {!header.isPlaceholder ? (
                    <div
                      {...(stickyColumns?.first !== i + 1 && {
                        className: 'tanstack-table-nonsticky-column-header',
                      })}
                      style={{
                        ...(stickyColumns?.first !== i + 1 && {
                          padding: `0px ${spaceStaticXs}`,
                        }),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: (
                          <span style={sortingIcons}>
                            <img
                              alt='sorted asending'
                              src={AscendingIcon}
                            ></img>
                          </span>
                        ),
                        desc: (
                          <span style={sortingIcons}>
                            <img
                              alt='sorted desending'
                              src={DescendingIcon}
                            ></img>
                          </span>
                        ),
                      }[header.column.getIsSorted() as string] ??
                        (stickyColumns?.first !== i + 1 && (
                          <span style={{ ...sortingIcons }}>
                            <img
                              alt='desending not active'
                              src={SortingIcon}
                            ></img>
                          </span>
                        ))}
                    </div>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {legendData.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, i) => (
                <td
                  key={cell.id}
                  className={
                    stickyColumns?.first === i + 1
                      ? 'tanstack-table-sticky-column-body'
                      : 'tanstack-table-body'
                  }
                  style={{
                    borderBottom: `1px solid ${colorBorderButtonPrimaryDisabled}`,
                    padding: `${spaceStaticXxxs} ${spaceStaticXxs}`,
                    ...(stickyColumns?.first === i + 1 && {
                      backgroundColor: `${colorBackgroundButtonNormalDefault}`,
                    }),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
