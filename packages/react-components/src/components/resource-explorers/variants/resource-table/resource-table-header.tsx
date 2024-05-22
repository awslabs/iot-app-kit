import { spaceScaledS } from '@cloudscape-design/design-tokens';
import React, { type ReactNode } from 'react';

import './resource-table-header.css';

export interface ResourceTableHeaderProps {
  pagination: ReactNode;
  title?: ReactNode;
  search?: ReactNode;
  filter?: ReactNode;
  userSettings?: ReactNode;
}

export function ResourceTableHeader({
  pagination,
  title,
  search,
  filter,
  userSettings,
}: ResourceTableHeaderProps) {
  return (
    <div className='table-header' style={{ marginBottom: spaceScaledS }}>
      {(search != null || filter != null) && title != null && title}

      {search != null && filter != null && (
        <div style={{ marginBottom: spaceScaledS }}>{search}</div>
      )}

      <div className='table-header-layout'>
        <div className='table-header-left'>
          {search == null && filter == null && title != null && title}
          {search != null && filter == null && search}
          {filter != null && filter}
        </div>

        <div
          className='table-header-right'
          style={{
            marginLeft: spaceScaledS,
          }}
        >
          {pagination}
          {userSettings}
        </div>
      </div>
    </div>
  );
}
