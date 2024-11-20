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
