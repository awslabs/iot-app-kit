import React from 'react';
import { default as tableSvg } from './table.svg';
import { default as tableSvgDark } from './table-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const TableIcon = () => {
  return (
    <WidgetIcon widget='Bar' defaultIcon={tableSvg} darkIcon={tableSvgDark} />
  );
};

export default TableIcon;
