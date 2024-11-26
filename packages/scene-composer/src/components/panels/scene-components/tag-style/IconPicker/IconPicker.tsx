import { Button, FormField, SpaceBetween, TextContent, TextFilter } from '@cloudscape-design/components';
import {
  type IconDefinition,
  type IconLookup,
  type IconName,
  type IconPrefix,
  library,
} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEmpty from 'lodash-es/isEmpty';
import { useCallback, useEffect, useState } from 'react';

import { type IIconPicker } from '../interface';
import './IconPickerUtils/IconPicker-aws-overrides.scss';

import { IconGridLayout, tmIconPickerContainer, tmIconPickerPopover } from './IconPickerUtils/IconPickerStyles';

library.add(fas);

export const IconPicker = ({
  selectedIcon,
  onSelectIconChange,
  iconPickerLabel,
  iconFilterText,
  iconFilterTextAriaLabel,
  iconButtonText,
}: IIconPicker): JSX.Element => {
  const [filteringText, setFilteringText] = useState<string>('');
  const [icon, setIcon] = useState<IconLookup>({
    prefix: selectedIcon.prefix as IconPrefix,
    iconName: selectedIcon.iconName as IconName,
  });
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const iconsPerPage = 8; // Number of icons per page
  const icons: IconDefinition[] = Object.values(fas); // Array of all Font Awesome Solid icons
  const totalPages = Math.ceil(icons.length / iconsPerPage); // Calculate the total number of pages
  const [currentPage] = useState<number>(1);
  const [numRows, setNumRows] = useState(totalPages);
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

  useEffect(() => {
    if (filteringText)
      setNumRows(0); //This will confine the popover to show only search results when user starts typing
    else setNumRows(totalPages); // restore default when no text in search field.
  }, [filteringText]);

  useEffect(() => {
    setIcon({
      prefix: selectedIcon.prefix as IconPrefix,
      iconName: selectedIcon.iconName as IconName,
    });
  }, [selectedIcon]);

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

  const emptyIcon = isEmpty(icon.iconName) && isEmpty(icon.prefix);
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
          iconSvg={!emptyIcon ? <FontAwesomeIcon icon={icon} /> : null}
          iconAlign='right'
          onClick={() => setShowPicker(!showPicker)}
        >
          {emptyIcon && iconButtonText}
        </Button>
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
                </div>
              </SpaceBetween>
            </div>
          )}
        </div>
      </FormField>
    </SpaceBetween>
  );
};
