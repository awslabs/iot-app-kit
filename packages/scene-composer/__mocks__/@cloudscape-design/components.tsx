import mockComponent from '../mockComponent';

import cloudscapeRaw from '@cloudscape-design/components';

const cloudscape = Object.keys(cloudscapeRaw).reduce((acc, comp) => {
  if (!comp.startsWith('_')) {
    acc[comp] = mockComponent(comp);
  } else {
    acc[comp] = cloudscapeRaw[comp];
  }
  return acc;
}, {});

const ButtonDropdown = ({ items = [], onItemClick, ...props }: any) => {
  return (
    <ul data-mocked='ButtonDropdown' {...props}>
      {items.map(({ id, text, iconSvg, ...itemProps }) => {
        return (
          <li id={id} {...itemProps} onClick={() => onItemClick({ detail: { id } })}>
            {iconSvg}
            {text}
          </li>
        );
      })}
    </ul>
  );
};

export * from '@cloudscape-design/components';

export { ButtonDropdown };
