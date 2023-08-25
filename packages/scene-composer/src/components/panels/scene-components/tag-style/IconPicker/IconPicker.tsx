import { Button, FormField, SpaceBetween, TextContent, TextFilter } from '@awsui/components-react';
import { IconDefinition, IconLookup, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';

import { IIconPicker } from '../interface';
import './IconPickerUtils/IconPicker-aws-overrides.scss';

import { IconGridLayout, tmIconPickerContainer, tmIconPickerPopover } from './IconPickerUtils/IconPickerStyles';

library.add(fas);

export const IconPicker = ({
  selectedIcon,
  onSelectIconChange,
  iconPickerLabel,
  iconFilterText,
  iconFilterTextAriaLabel,
}: IIconPicker): JSX.Element => {
  const [filteringText, setFilteringText] = useState<string>('');
  const [icon, setIcon] = useState<IconLookup>(selectedIcon);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const iconsPerPage = 8; // Number of icons per page
  const defaultRows = 3; // Number of rows to display by default
  const icons: IconDefinition[] = Object.values(fas); // Array of all Font Awesome Solid icons
  const totalPages = Math.ceil(icons.length / iconsPerPage); // Calculate the total number of pages
  const [currentPage] = useState<number>(1);
  const [numRows, setNumRows] = useState(defaultRows);
  const generateRandomString = Math.random().toString(16).slice(2);
  const [randomDomId] = useState<string>(generateRandomString);
  // Calculate the starting and ending index of icons for the current page
  const startIndex = (currentPage - 1) * iconsPerPage;
  const endIndex = Math.min(startIndex + numRows * iconsPerPage, icons.length);

  // Generate an array of icons for the current page
  const currentIcons = icons.slice(startIndex, endIndex);
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const buttonsvg = document.getElementById('button-svg' + `${randomDomId}`);
    if (buttonsvg && buttonsvg.contains(target)) {
      return; // We have a different handler for button click
    }
    const pickerContainer = document.getElementById('icon-picker' + `${randomDomId}`);
    if (pickerContainer && !pickerContainer.contains(target)) {
      setShowPicker(false);
    }
  }, []);

  useEffect(() => {
    if (showPicker) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showPicker, handleOutsideClick]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollTop + clientHeight === scrollHeight && numRows < totalPages) {
      setNumRows(numRows + 1);
    }
  };
  const handleIconClick = (newselectedIcon) => {
    onSelectIconChange(newselectedIcon);
    setIcon(newselectedIcon);
  };

  const filterIcons = (icons: IconDefinition[]): IconDefinition[] => {
    if (!filteringText) {
      return [];
    }
    return icons.filter((icon) => icon.iconName.toLowerCase().includes(filteringText.toLowerCase()));
  };

  const filteredIcons = filterIcons(Object.values(fas));

  useEffect(() => {
    setIcon(selectedIcon);
  }, [selectedIcon]);

  return (
    <SpaceBetween size='l' direction='horizontal'>
      <TextContent>
        <h5>{iconPickerLabel}</h5>
      </TextContent>
      <FormField>
        <Button
          id={'button-svg' + `${randomDomId}`}
          className='tm-icon-picker-button'
          data-testid='icon-button'
          iconSvg={<FontAwesomeIcon icon={icon} />}
          iconAlign='right'
          onClick={() => setShowPicker(!showPicker)}
        />
        <div id={'icon-picker' + `${randomDomId}`} style={tmIconPickerContainer}>
          {showPicker && (
            <div data-testid='icon-popover' style={tmIconPickerPopover}>
              <SpaceBetween size='s'>
                <TextFilter
                  filteringText={filteringText}
                  filteringPlaceholder={iconFilterText}
                  filteringAriaLabel={iconFilterTextAriaLabel}
                  onChange={({ detail }) => setFilteringText(detail.filteringText)}
                />
                <div style={IconGridLayout}>
                  {filteredIcons.map((icon, index) => {
                    return <FontAwesomeIcon key={index} icon={icon} onClick={() => handleIconClick(icon)} />;
                  })}
                </div>
                <div data-testid='icon-list' style={IconGridLayout} onScroll={handleScroll}>
                  {currentIcons.map((icon, index) => {
                    return <FontAwesomeIcon key={index} icon={icon} onClick={() => handleIconClick(icon)} />;
                  })}
                </div>{' '}
              </SpaceBetween>
            </div>
          )}
        </div>
      </FormField>
    </SpaceBetween>
  );
};
