import { spaceScaledS } from '@cloudscape-design/design-tokens';
import React, { type ReactNode } from 'react';

import type {
  IsTableFilterEnabled,
  IsTableTitleless,
  IsTableSearchEnabled,
  IsTableUserSettingsEnabled,
} from '../types/common';

import './resource-table-header.css';

export interface ResourceTableHeaderProps {
  isTitleless?: IsTableTitleless;
  isFilterEnabled?: IsTableFilterEnabled;
  isSearchEnabled?: IsTableSearchEnabled;
  isUserSettingsEnabled?: IsTableUserSettingsEnabled;
  title: ReactNode;
  search: ReactNode;
  filter: ReactNode;
  pagination: ReactNode;
  userSettings: ReactNode;
}

export function ResourceTableHeader({
  isTitleless,
  isFilterEnabled,
  isSearchEnabled,
  isUserSettingsEnabled,
  title,
  search,
  filter,
  pagination,
  userSettings,
}: ResourceTableHeaderProps) {
  return (
    <div className='table-header' style={{ marginBottom: spaceScaledS }}>
      {(isSearchEnabled || isFilterEnabled) && !isTitleless && title}

      {isSearchEnabled && isFilterEnabled && (
        <div style={{ marginBottom: spaceScaledS }}>{search}</div>
      )}

      <div className='table-header-layout'>
        <div className='table-header-left'>
          {!isSearchEnabled && !isFilterEnabled && !isTitleless && title}
          {isSearchEnabled && !isFilterEnabled && search}
          {isFilterEnabled && filter}
        </div>

        <div
          className='table-header-right'
          style={{
            marginLeft: spaceScaledS,
          }}
        >
          {pagination}
          {isUserSettingsEnabled && userSettings}
        </div>
      </div>
    </div>
  );
}
