import React from 'react';
import mockComponent from '../mockComponent';

const awsuiRaw: any = jest.createMockFromModule('@awsui/components-react');

const awsui = Object.keys(awsuiRaw).reduce((acc, comp) => {
  if (!comp.startsWith('_')) {
    acc[comp] = mockComponent(comp);
  } else {
    acc[comp] = awsuiRaw[comp];
  }
  return acc;
}, {});

module.exports = {
  ...awsui,
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
