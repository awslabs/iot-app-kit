import React from 'react';
import mockComponent from '../mockComponent';

const cloudscapeRaw: any = jest.createMockFromModule('@cloudscape-design/components');

const cloudscape = Object.keys(cloudscapeRaw).reduce((acc, comp) => {
  if (!comp.startsWith('_')) {
    acc[comp] = mockComponent(comp);
  } else {
    acc[comp] = cloudscapeRaw[comp];
  }
  return acc;
}, {});

module.exports = {
  ...cloudscape,
  ButtonDropdown: ({ items = [], onItemClick, ...props }: any) => {
    return (
      <ul data-mocked='ButtonDropdown' {...props}>
        { items.map(({ id, text, iconSvg, ...itemProps }) => {
          return (<li id={id} {...itemProps} onClick={() => onItemClick({ detail: { id }})}>{iconSvg}{text}</li>)
        })}
      </ul>
    )
  }
};
