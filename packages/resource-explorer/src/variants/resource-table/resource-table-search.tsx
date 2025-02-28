import CloudscapeButton from '@cloudscape-design/components/button';
import CloudscapeInput from '@cloudscape-design/components/input';
import {
  colorTextFormDefault,
  fontSizeBodyM,
  fontWeightHeadingXs,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import { useState } from 'react';

import './resource-table-search.css';
import type { OnClickSearch } from '../../types/common';

export interface ResourceTableSearchProps {
  onClickSearch: OnClickSearch;
}

export function ResourceTableSearch({
  onClickSearch,
}: ResourceTableSearchProps) {
  const [searchInputValue, setSearchInputValue] = useState('');

  function handleKeyDown(key: string) {
    if (key === 'Enter') {
      onClickSearch(searchInputValue);
    }
  }

  function handleClickSearch() {
    onClickSearch(searchInputValue);
  }

  return (
    <div className='search-field'>
      <label
        htmlFor='search'
        style={{
          color: colorTextFormDefault,
          fontSize: fontSizeBodyM,
          fontWeight: fontWeightHeadingXs,
          marginRight: spaceScaledXs,
        }}
      >
        Search
      </label>

      <div
        className='search-field-input'
        style={{ marginRight: spaceScaledXs }}
      >
        <CloudscapeInput
          type='search'
          inputMode='search'
          value={searchInputValue}
          onChange={({ detail: { value } }) => setSearchInputValue(value)}
          placeholder='Search for resources'
          controlId='search'
          onKeyDown={({ detail: { key } }) => handleKeyDown(key)}
        />
      </div>

      <CloudscapeButton onClick={handleClickSearch}>Search</CloudscapeButton>
    </div>
  );
}
